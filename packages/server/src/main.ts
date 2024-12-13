import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import ContentService from './content.service';

const logger = new Logger('bootstrap');

async function bootstrap(): Promise<void> {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  const contentService = app.get(ContentService);
  const staticRoot = contentService.getStaticAssetRoot();
  app.useStaticAssets(staticRoot);

  logger.log(`Using static root: ${staticRoot}`);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((e: unknown) => {
  console.error('Application failed:', e);
});
