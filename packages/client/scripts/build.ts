import { watch } from 'fs';
import { stat } from 'fs/promises';
import { basename, dirname, join, relative, resolve } from 'path';
import { type BuildOutput } from 'bun';
import { distRoot, globScan, packageRoot, publicDistRoot, publicRoot, srcRoot, viewRoot } from './shared';

const templatePath = resolve(join(packageRoot, 'src/views/template.html'));
const templateData = await Bun.file(templatePath).text();

const isWatching = process.argv.includes('--watch');

interface View {
  name: string,
  path: string,
  main: string,
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

async function copyAssets(): Promise<void> {
  const assets = await globScan('**/*', { cwd: publicRoot });
  await Promise.all(
    assets.map((asset: string) => ([
      join(publicRoot, asset),
      join(distRoot, 'public', asset)
    ]))
    .map(([sourcePath, targetPath]) => Bun.write(targetPath, Bun.file(sourcePath)))
  );
}

async function buildView(view: View): Promise<BuildOutput> {
  console.log(`Building view '${view.name}'`);

  // Bundle JS
  const buildPath = join(distRoot, 'public', `${view.name}.js`);
  const result = await Bun.build({
    entrypoints: [view.main],
    outdir: dirname(buildPath),
    naming: basename(buildPath),
  });

  if (!result.success)
    return result;

  // Generate corresponding html
  const templatePath = join(viewRoot, `${view.name}.html`)
  const mainPath = relative(publicDistRoot, buildPath);

  // Usually there's only one `{main}` reference per template, but pays to be
  // prepared
  const htmlData = templateData.replaceAll('{main}', mainPath);
  await Bun.write(templatePath, htmlData);

  return result;
}

async function build(): Promise<void> {
  await copyAssets();

  // Render views
  const views = await gatherViews();
  const viewResults = (await Promise.all(views.map(buildView)))
    .map((result, idx) => ({ view: views[idx], result }));

  // Log results
  viewResults.filter(({ result }) => result.success)
    .forEach(({ view, result }) =>
      console.log(`Successfully built "${view.name}":\n`, result.logs, '\n')
    )
  
  // Log errors
  viewResults.filter(({ result }) => !result.success)
    .forEach(({ view, result }) =>
      console.error(`Couldn't build "${view.name}"!\n`, result.logs, '\n')
    )
}

if (isWatching) {
  const watcher = watch(srcRoot, { recursive: true }, () => {
    void build();
  });
  console.log(`Watching "${srcRoot}" for changes...`);
  process.on('beforeExit', () => {
    watcher.close();
  });
}

await build();
