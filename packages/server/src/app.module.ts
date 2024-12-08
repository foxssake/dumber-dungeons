import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViewService } from './view.service';
import { PathsModule } from './paths/paths.module';

@Module({
  imports: [PathsModule],
  controllers: [AppController],
  providers: [AppService, ViewService],
})
export class AppModule {}
