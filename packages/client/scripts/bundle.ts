await Bun.build({
  entrypoints: [
    './src/views/threejs/page.tsx'
  ],
  outdir: './dist/'
})
