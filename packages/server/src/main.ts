import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { distRoot } from './root.paths';

const logger = new Logger('bootstrap');

async function bootstrap(): Promise<void> {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  app.useStaticAssets(distRoot);

  logger.log(`Using static root: ${distRoot}`);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((e: unknown) => {
  console.error('Application failed:', e);
});
