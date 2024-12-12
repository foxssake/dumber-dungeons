import { watch } from 'fs';
import html from 'bun-plugin-html';

const build = async (): Promise<void> => {
  const response = await Bun.build({
    entrypoints: ['src/index.tsx'],
    outdir: 'dist',
    plugins: [html()],
  });
  if(response.success)
    console.log('succesfully done at', new Date().toISOString());
  else
    console.log(response.logs);
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
