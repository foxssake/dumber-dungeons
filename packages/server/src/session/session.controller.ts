import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { SessionService } from './session.service';
import type { Session } from './session';
import type { Participant } from './participant';
import { verify } from '@dumber-dungeons/shared/src/verify';

// TODO: Remove in #40 in favor of WS messages
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  public createSession(): Promise<Session> {
    return this.sessionService.create();
  }

  @Get('/:id')
  public async getSession(@Param('id') id: string): Promise<Session> {
    const session = await this.sessionService.find(id);
    verify(session, new HttpException('Unknown session', HttpStatus.NOT_FOUND));
    return session;
  }

  @Post('/:id/participants')
  public async joinSession(@Param('id') id: string): Promise<Participant> {
    const session = await this.sessionService.find(id);
    verify(session, new HttpException('Unknown session', HttpStatus.NOT_FOUND));

    const participant = await this.sessionService.join(session);
    return participant;
  }
}
