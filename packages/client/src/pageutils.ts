import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

interface RenderPageOptions {
  title?: string;
}

export function renderPage(page: ReactNode, options: RenderPageOptions = {}): void {
  const rootElement = document.querySelector('#root');
  if(!rootElement) {
    throw new Error('Root element not found!');
  }

  const root = createRoot(rootElement);
  root.render(page);

  if (options.title) {
    document.title = options.title;
  }
}
