import type { ReactNode } from "react"
import { createRoot } from "react-dom/client";

export interface PageOptions {
  title?: string,
  cssPaths?: Array<string>
}

export interface Route {
  prefix: string,
  component: ReactNode,
  options?: PageOptions
}

export class Router {
  private routes: Array<Route> = [];
  private notFoundRoute: Route | undefined;
  private globalStylesheets: Array<string> = [];

  public withRoute(prefix: string, component: ReactNode, options?: PageOptions): Router {
    this.routes.push({
      prefix, component, options
    })

    // Sort routes by prefix length, descending
    // This ensures that always the most specific routes are evaluated first
    this.routes.sort((a, b) => b.prefix.length - a.prefix.length)
    return this;
  }

  public withNotFound(component: ReactNode, options?: PageOptions): Router {
    this.notFoundRoute = {
      prefix: '',
      component, options
    };
    return this;
  }

  public withGlobalStylesheet(...stylePaths: Array<string>): Router {
    stylePaths.forEach(stylePath => this.globalStylesheets.push(stylePath));
    return this;
  }

  public render(url: URL): void {
    const route = this.findRouteFor(url);
    const options = route.options ?? {};
    
    // Apply document title
    document.title = options.title ?? document.title;

    // Apply stylesheets
    this.clearStylesheets();

    [...this.globalStylesheets, ...(options.cssPaths ?? [])]
      .map(stylePath => this.makeStyleLink(stylePath))
      .forEach(link => document.head.appendChild(link));
    
    // Render root
    const rootElement = this.ensureRoot();
    const root = createRoot(rootElement);
    root.render(route.component);
  }

  private findRouteFor(url: URL): Route {
    const route = this.routes.find(route => url.pathname.startsWith(route.prefix)) ??
      this.notFoundRoute;

    if (!route)
      throw new Error('Unknown route: ' + url);

    return route;
  }

  private makeStyleLink(path: string): HTMLLinkElement {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;

    return link;
  }

  private clearStylesheets(): void {
    document.head.querySelectorAll('link').forEach(link => link.remove());
  }

  private ensureRoot(): Element {
    const root = document.querySelector('#root');

    if (root)
      return root;

    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);
    console.warn('No root in HTML!');

    return div;
  }
}
