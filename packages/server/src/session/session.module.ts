import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionDAO } from './session.dao';
import { IDGenerator } from 'src/id.generator';

@Module({
  providers: [SessionService, SessionDAO, IDGenerator],
  controllers: [SessionController],
})
export class SessionModule {}
