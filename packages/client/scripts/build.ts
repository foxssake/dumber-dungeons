import { watch } from 'fs';
import { stat } from 'fs/promises';
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
  name: string,
  path: string,
  main: string,
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
    const viewName = basename(viewDir);
    const mainFile = join(viewDir, viewName + '.tsx');

    if(!(await stat(viewDir)).isDirectory()) {
      // Not a view directory
      continue
    }

    if (!await Bun.file(mainFile).exists()) {
      console.error(`View '${viewName}' is missing page file '${mainFile}'! Skipping.`)
      continue;
    }

    views.push({
      name: viewName,
      path: viewDir,
      main: mainFile,
    });
  }

  return views;
}

async function build(): Promise<void> {
  // Copy assets
  const assets = await globScan('**/*', { cwd: publicRoot });
  await Promise.all(
    assets.map((asset: string) => ([
      join(publicRoot, asset),
      join(distRoot, 'public', asset)
    ]))
    .map(([sourcePath, targetPath]) => Bun.write(targetPath, Bun.file(sourcePath)))
  );

  // Render views
  const views = await gatherViews();
  const failedViews = [];

  for (const view of views) {
    console.log(`Building view '${view.name}'`);

    // Bundle as JS
    const result = await Bun.build({
      entrypoints: [view.main],
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
    console.error('Failed building views:\n', failedViews.join('\n'));
  }
}

if (isWatching) {
  const watcher = watch(srcRoot, { recursive: true }, () => {
    void build();
  });
  console.log(`Watching "${srcRoot}" for changes...`);
  process.on('beforeExit', () => {
    watcher.close();
  });

  await build();
} else {
  await build();
}
