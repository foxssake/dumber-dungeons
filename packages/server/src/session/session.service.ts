import { Injectable } from '@nestjs/common';
import { SessionDAO } from './session.dao';
import { type Session, SessionStatus } from '@dumber-dungeons/shared/src/api';
import assert from 'node:assert';
import { IDGenerator } from 'src/utils/id.generator';
import type { Participant } from './participant';
import { verify } from '@dumber-dungeons/shared/src/verify';

export type JoinSessionOptions = {
  name?: string;
  isDisplay?: boolean;
};

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionDAO: SessionDAO,
    private readonly idGenerator: IDGenerator
  ) {}

  public async create(): Promise<Session> {
    const session: Session = {
      id: this.idGenerator.forSession(),
      status: SessionStatus.IN_LOBBY,
      participants: [],
    };

    await this.sessionDAO.save(session);

    return session;
  }

  public async join(
    session: Session,
    options?: JoinSessionOptions
  ): Promise<Participant> {
    assert(await this.hasSession(session), 'Unknown session!');

    verify(
      session.status == SessionStatus.IN_LOBBY,
      "Session can only be joined if it's in lobby!"
    );

    // Create and save participant
    const participant: Participant = {
      id: this.idGenerator.forParticipant(),
      name: options?.name ?? '',
      isReady: false,
      isDisplay: options?.isDisplay ?? false,
      authToken: this.idGenerator.forAuth(),
    };

    // Save updated session
    session.participants.push(participant);
    await this.sessionDAO.save(session);

    return participant;
  }

  public async start(session: Session): Promise<Session> {
    assert(await this.hasSession(session), 'Unknown session!');

    verify(
      session.status == SessionStatus.IN_LOBBY,
      "Session can only be started if it's in lobby!"
    );

    session.status = SessionStatus.ACTIVE;
    await this.sessionDAO.save(session);

    return session;
  }

  public find(id: string): Promise<Session | undefined> {
    return this.sessionDAO.find(id);
  }

  private hasSession(session: Session): Promise<boolean> {
    return this.sessionDAO.has(session.id);
  }
}
