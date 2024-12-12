import { watch } from 'fs';
import { basename, dirname, extname, join, relative, resolve } from 'path';

const packageDir = resolve(join(dirname(import.meta.path), '..'));
const distDir = resolve(join(packageDir, 'dist'));

const htmlTemplate = await Bun.file(
  join(packageDir, 'src/template.html')
).text();

const writeHtml = async (builtEntryPath: string): Promise<void> => {
  const relativePath = relative(distDir, builtEntryPath);
  const entryName = basename(builtEntryPath, extname(builtEntryPath));

  const htmlPath = join(dirname(builtEntryPath), `${entryName}.html`);
  const htmlText = htmlTemplate.replaceAll('{scriptPath}', relativePath);

  await Bun.write(htmlPath, htmlText);
};

const build = async (): Promise<void> => {
  const response = await Bun.build({
    entrypoints: ['src/index.tsx'],
    outdir: distDir,
    plugins: [],
  });

  if (response.success)
    console.log('succesfully done at', new Date().toISOString());
  else console.log(response.logs);

  await Promise.all(
    response.outputs
      .filter((output) => output.kind == 'entry-point')
      .map((entryPoint) => writeHtml(entryPoint.path))
  ).catch((e: unknown) => {
    console.log('Could not write html files:', e);
  });
};

const isWatching = process.argv.includes('--watch');

if (isWatching) {
  const watcher = watch('./src', { recursive: true }, () => void build());
  console.log('Watching "src" for changes...');
  process.on('beforeExit', () => {
    watcher.close();
  });
}
await build();
