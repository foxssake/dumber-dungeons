import { Controller, Get, Param, Post } from '@nestjs/common';
import { SessionService } from './session.service';
import type { Session } from './session';
import type { Participant } from './participant';

// TODO: Remove in #40 in favor of WS messages
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  public createSession(): Promise<Session> {
    return this.sessionService.create();
  }

  @Get('/:id')
  public getSession(@Param('id') id: string): Promise<Session | undefined> {
    return this.sessionService.find(id);
  }

  @Post('/:id/participants')
  public async joinSession(@Param('id') id: string): Promise<Participant | undefined> {
    const session = await this.sessionService.find(id);
    const participant = session && await this.sessionService.join(session);
    return participant;
  }
}
