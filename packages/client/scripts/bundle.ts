import html from 'bun-plugin-html';
import { watch } from 'fs';
import { join, resolve } from 'path';

const srcRoot = resolve(join(import.meta.dir, '/../src/'))
const isDev = process.env.DEV == 'true'

async function bundle() {
  const result = await Bun.build({
    entrypoints: [
      './src/views/threejs/index.html'
      // './src/views/threejs/page.tsx'
    ],
    outdir: './dist/',
    plugins: [
      html()
    ]
  })

  result.logs.forEach(log => console.log(log))
}


if (isDev) {
  const watcher = watch(srcRoot, { recursive: true }, () => bundle())
  bundle()

  process.on('beforeExit', () => {
    watcher.close()
  })
} else {
  await bundle();
}
