/* eslint-disable import-x/no-nodejs-modules */

import { basename, join } from 'path';
import { env } from 'process';
import { globScan, publicDistRoot, viewRoot } from './shared';

const port = env.PORT ?? 3000;

// Serve
async function serveIndex(request: Request): Promise<Response | undefined> {
  // Check path
  if (new URL(request.url).pathname != '/') return undefined;

  // List views
  const viewNames = (await globScan('*.html', { cwd: viewRoot })).map((path) =>
    basename(path, '.html')
  );

  const viewList = viewNames
    .map((viewName) => `<a href="/${viewName}">${viewName}</a>`)
    .map((link) => `<li>${link}</li>`)
    .join('');

  const html = `<html><body><ul>${viewList}</ul></body></html>`;

  return new Response(html, { headers: [['Content-Type', 'text/html']] });
}

async function serveView(request: Request): Promise<Response | undefined> {
  // Check if view exists
  const viewName = new URL(request.url).pathname.split('/')[1];
  const view = Bun.file(join(viewRoot, `${viewName}.html`));

  if (!(await view.exists())) return undefined;

  return new Response(view);
}

async function serveAsset(request: Request): Promise<Response | undefined> {
  const assetPath = new URL(request.url).pathname;
  const asset = Bun.file(join(publicDistRoot, assetPath));

  if (!(await asset.exists())) return undefined;

  return new Response(asset);
}

function serveNotFound(request: Request): Response {
  const path = new URL(request.url).pathname;

  console.error('Not found:', path);
  return new Response(`Not found: ${path}`, { status: 404 });
}

Bun.serve({
  port,
  async fetch(req) {
    if (req.method != 'GET') {
      return new Response('', { status: 405 });
    }

    return (
      (await serveIndex(req)) ??
      (await serveView(req)) ??
      (await serveAsset(req)) ??
      serveNotFound(req)
    );
  },
});

console.log(`Listening at http://localhost:${port}/`);
