import { Controller, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import type { Session } from './session';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  public createSession(): Promise<Session> {
    return this.sessionService.create();
  }
}
