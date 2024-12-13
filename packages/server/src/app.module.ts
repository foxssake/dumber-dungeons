import { resolve, join } from 'path';
import {
  Module,
  RequestMethod,
  type MiddlewareConsumer,
  type NestModule,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import ContentService from './content.service';
import SPAMiddleware from './spa.middleware';

const packageRoot = resolve(join(import.meta.dir, '../../'));
const projectRoot = resolve(join(packageRoot, '../'));
const distRoot = resolve(join(projectRoot, 'packages', 'client', 'dist'));

@Module({
  imports: [SessionModule],
  providers: [
    AppService,
    {
      provide: ContentService,
      useValue: new ContentService(distRoot),
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SPAMiddleware)
      .forRoutes({ method: RequestMethod.GET, path: '*' });
  }
}
