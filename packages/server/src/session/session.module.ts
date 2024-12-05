import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionDAO } from './session.dao';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [SessionService, SessionDAO],
  controllers: [SessionController],
  imports: [UtilsModule],
})
export class SessionModule {}
