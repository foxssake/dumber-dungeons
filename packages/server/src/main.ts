import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

const DIST_ROOT = join(__dirname, '../../../dist/');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(DIST_ROOT);

  await app.listen(process.env.PORT ?? 3000);
}

await bootstrap();
