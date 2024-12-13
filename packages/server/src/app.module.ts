import { resolve, join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import ContentService from './content.service';

const packageRoot = resolve(join(import.meta.dir, '../../'));
const projectRoot = resolve(join(packageRoot, '../'));
const distRoot = resolve(join(projectRoot, 'packages', 'client', 'dist'));

@Module({
  imports: [SessionModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: ContentService,
      useValue: new ContentService(distRoot),
    },
  ],
})
export class AppModule {}
