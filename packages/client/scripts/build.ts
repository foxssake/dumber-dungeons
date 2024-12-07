import { watch } from 'fs';
import { basename, join, resolve } from 'path';
import { Glob, type GlobScanOptions } from 'bun';

const packageRoot = resolve(join(import.meta.dir, '../'));
const projectRoot = resolve(join(packageRoot, '../../'));
const srcRoot = resolve(join(packageRoot, 'src'));
const publicRoot = resolve(join(packageRoot, 'public'));
const distRoot = resolve(join(projectRoot, 'dist'));
const templatePath = resolve(join(packageRoot, 'src/views/template.html'));
const templateData = await Bun.file(templatePath).text();

const isWatching = process.argv.includes('--watch');

interface View {
  name: string;
  path: string;
  main: string;
  tsxFiles: string[];
}

async function globScan(
  pattern: string,
  options: GlobScanOptions = {}
): Promise<Array<string>> {
  const glob = new Glob(pattern);
  return Array.fromAsync(glob.scan(options));
}

async function gatherViews(): Promise<Array<View>> {
  const views: Array<View> = [];
  const viewDirectories = await globScan('views/*', {
    cwd: srcRoot,
    absolute: true,
    onlyFiles: false,
  });

  for (const viewDir of viewDirectories) {
    // Look for .tsx files
    const tsxFiles = await globScan('*.tsx', { cwd: viewDir }).catch(() => []);

    // Not a valid view
    if (tsxFiles.length == 0) continue;

    // Multiple pages per view
    if (tsxFiles.length > 1)
      console.warn('Multiple page files found for view!', viewDir);

    const viewName = basename(viewDir);
    const mainFile = tsxFiles[0];

    views.push({
      name: viewName,
      path: viewDir,
      main: mainFile,
      tsxFiles: tsxFiles,
    });
  }

  return views;
}

async function build(): Promise<void> {
  // Copy assets
  const assets = await globScan('**/*', { cwd: publicRoot });
  assets.forEach((asset) => {
    const sourcePath = join(publicRoot, asset);
    const targetPath = join(distRoot, 'public', asset);

    void Bun.write(targetPath, Bun.file(sourcePath));
  });

  // Render views
  const views = await gatherViews();
  const failedViews = [];

  for (const view of views) {
    console.log(`Building view '${view.name}'`);

    // Bundle as JS
    const result = await Bun.build({
      entrypoints: [join(view.path, view.main)],
      outdir: join(distRoot, 'public'),
      naming: `${view.name}.js`,
    });

    result.logs.forEach((log) => {
      console.log(log);
    });

    if (!result.success) {
      failedViews.push(view);
      continue;
    }

    // Generate corresponding html
    const htmlData = templateData.replaceAll('{main}', `${view.name}.js`);
    await Bun.write(join(distRoot, 'views', `${view.name}.html`), htmlData);
  }

  if (failedViews.length > 0) {
    console.error('Failed building views:\n', failedViews.map(view => `\t${  view.name}`).join('\n'));
  }
}

if (isWatching) {
  const watchPaths = [srcRoot, publicRoot];
  const watchers = watchPaths.map((path) =>
    watch(path, { recursive: true }, () => {
      void build();
    })
  );

  console.log('Watching directories for changes:\n', watchPaths);

  process.on('beforeExit', () => {
    watchers.forEach((watcher) => { watcher.close(); });
  });

  await build();
} else {
  await build();
}
