import { Module } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { FrontendController } from './frontend.controller';

@Module({
  imports: [SessionModule],
  controllers: [FrontendController],
})
export class AppModule {
}
