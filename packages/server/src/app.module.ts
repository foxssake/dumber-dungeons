import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionModule } from './session/session.module';
import { IDGenerator } from './id.generator';

@Module({
  imports: [SessionModule],
  controllers: [AppController],
  providers: [AppService, IDGenerator],
})
export class AppModule {}
