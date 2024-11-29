import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ViewService } from './view.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ViewService],
})
export class AppModule {}
