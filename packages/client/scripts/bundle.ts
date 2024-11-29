import { watch } from 'fs';
import { join, relative, resolve } from 'path';
import { Glob } from 'bun';

const projectRoot = resolve(join(import.meta.dir, '../'));
const srcRoot = resolve(join(projectRoot, '/src'));
const targetDir = resolve(join(projectRoot, 'public/dist'))

const isWatching = process.argv.includes('--watch')

async function bundle() {
  const glob = new Glob('views/**/*.tsx');
  const pages = (await Array.fromAsync(glob.scan({ cwd: srcRoot, absolute: true })))
    .map(path => relative(projectRoot, path));

  console.log('Found pages\n', pages.map(path => '\t' + path).join('\n'))

  const result = await Bun.build({
    entrypoints: pages,
    outdir: targetDir,
    plugins: []
  })

  result.logs.forEach(log => console.log(log))
}


if (isWatching) {
  const watcher = watch(srcRoot, { recursive: true }, () => bundle())
  console.log(`Watching "${srcRoot}" for changes...`)
  bundle()

  process.on('beforeExit', () => {
    watcher.close()
  })
} else {
  await bundle();
}
