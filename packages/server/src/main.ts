import { resolve, join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

const logger = new Logger('bootstrap');

const packageRoot = resolve(join(import.meta.dir, '../'));
const projectRoot = resolve(join(packageRoot, '../../'));
const distRoot = resolve(join(projectRoot, 'dist/'));

const viewsRoot = join(distRoot, 'views');
const staticRoot = join(distRoot, 'public');

async function bootstrap(): Promise<void> {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  app.useStaticAssets(staticRoot);

  logger.log(`Using views root: ${viewsRoot}`);
  logger.log(`Using static root: ${staticRoot}`);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((e: unknown) => {
  console.error('Application failed:', e);
});
