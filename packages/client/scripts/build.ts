import { watch } from 'fs';
import { basename, dirname, extname, join, relative, resolve } from 'path';

const packageDir = resolve(join(dirname(import.meta.path), '..'));
const distDir = resolve(join(packageDir, 'dist'));

const htmlTemplate = await Bun.file(join(packageDir, 'src/template.html')).text();

const writeHtml = async (sourcePath: string): Promise<void> => {
  const relativePath = relative(distDir, sourcePath);
  const resultName = basename(sourcePath, extname(sourcePath));

  const htmlPath = join(dirname(sourcePath), `${resultName}.html`);
  const htmlText = htmlTemplate.replaceAll('{main}', relativePath);

  await Bun.write(htmlPath, htmlText);
};

const build = async (): Promise<void> => {
  const response = await Bun.build({
    entrypoints: ['src/index.tsx'],
    outdir: distDir,
    plugins: [],
  });
  // TODO: remove logs
  console.log(response);
  if(response.success)
    console.log('succesfully done at', new Date().toISOString());
  else
    console.log(response.logs);

  await Promise.all(response.outputs
    .filter(output => output.kind == 'entry-point')
    .map(output => writeHtml(output.path)));
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
