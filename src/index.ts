Bun.serve({
  async fetch(req: Request) {
    const url = new URL(req.url);

    // Fixed routes
    if (url.pathname === '/pixijs')
      return new Response(Bun.file('public/pixijs.html'));

    // Asset routes
    if (url.pathname.startsWith('/assets/'))
      return new Response(Bun.file(url.pathname.slice(1)));

    // Public routes
    const publicFile = Bun.file(`public${url.pathname}`);
    console.log('Trying public path', publicFile.name);
    if (await publicFile.exists())
      return new Response(publicFile);

    return new Response('?');
  }
});
