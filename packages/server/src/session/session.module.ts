import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionDAO } from './session.dao';
import { UtilsModule } from 'src/utils/utils.module';
import { ParticipantDAO } from './participant.dao';

@Module({
  providers: [SessionService, SessionDAO, ParticipantDAO],
  controllers: [SessionController],
  imports: [UtilsModule],
})
export class SessionModule {}
