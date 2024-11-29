import { basename, join, resolve } from 'path';
import { Glob, type GlobScanOptions } from 'bun';
import { env } from 'process';

const projectRoot = resolve(join(import.meta.dir, '../'));
const distRoot = resolve(join(projectRoot, 'dist'));
const viewRoot = resolve(join(distRoot, 'views'));
const publicRoot = resolve(join(distRoot, 'public'));

const port = env.PORT ?? 3000

async function globScan(pattern: string, options: GlobScanOptions = {}): Promise<Array<string>> {
  const glob = new Glob(pattern);
  return Array.fromAsync(glob.scan(options));
}

// List views
const views = (await globScan('*.html', { cwd: viewRoot }))
  .map(path => basename(path, '.html'));
console.log('Found views', views)

// Serve
Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const urlPath = url.pathname.slice(1); // Remove '/' prefix

    if (req.method != 'GET') {
      return new Response('', { status: 405 })
    }

    // Check if it's index
    if (urlPath == '') {
      const html =
        '<html><body>' + 
        views.map(view => `<a href="/${view}">${view}</a>`).join('\n') +
        '</body></html>';

      return new Response(html, { headers: [['Content-Type', 'text/html']] });
    }

    // Check if view exists
    const view = Bun.file(join(viewRoot, `${urlPath}.html`))
    if (await view.exists()) {
      return new Response(view);
    }

    // Check if asset exists
    const asset = Bun.file(join(publicRoot, url.pathname))
    if (await asset.exists()) {
      return new Response(asset)
    }

    console.error('Not found:', url.pathname);
    return new Response(`Not found: ${url.pathname}`, { status: 404 });
  }
})

console.log(`Listening at http://localhost:${port}/`)
