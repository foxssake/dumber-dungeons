import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import globalStylesPath from './views/style.css';

interface RenderPageOptions {
  title?: string;
  cssPaths?: Array<string>;
}

export function applyStylesheet(path: string): void {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = path;

  document.head.appendChild(link);
}

export function renderPage(
  page: ReactNode,
  options: RenderPageOptions = {}
): void {
  // Apply document title
  document.title = options.title ?? document.title;

  // Apply stylesheets
  [globalStylesPath, ...(options.cssPaths ?? [])].forEach(applyStylesheet);

  // Render root
  const rootElement = document.querySelector('#root');
  if (!rootElement) {
    throw new Error('Root element not found!');
  }

  const root = createRoot(rootElement);
  root.render(page);
}
