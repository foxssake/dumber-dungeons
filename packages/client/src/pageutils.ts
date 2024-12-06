import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

interface RenderPageOptions {
  title?: string;
}

export function renderPage(page: ReactNode, options: RenderPageOptions = {}) {
  const root = createRoot(document.getElementById('root')!);
  root.render(page);

  if (options.title) {
    document.title = options.title;
  }
}
