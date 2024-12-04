import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionDAO } from './session.dao';

@Module({
  providers: [SessionDAO, SessionService],
  controllers: [SessionController]
})
export class SessionModule {}
