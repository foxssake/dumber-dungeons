Bun.serve({
  fetch(req: Request) {
    const url = new URL(req.url)
    if (url.pathname === '/pixijs')
      return new Response(Bun.file('view/pixijs.html'))

    return new Response('/')
  }
})
