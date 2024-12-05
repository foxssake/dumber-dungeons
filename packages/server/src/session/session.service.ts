import { Injectable } from '@nestjs/common';
import { SessionDAO } from './session.dao';
import { type Session, SessionStatus } from './session';
import { assert } from 'src/assert';
import type { IDGenerator } from 'src/utils/id.generator';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionDAO: SessionDAO,
    private readonly idGenerator: IDGenerator
  ) {}

  public create(): Session {
    const session: Session = {
      id: this.idGenerator.forSession(),
      status: SessionStatus.IN_LOBBY,
      participants: [],
    };

    this.sessionDAO.save(session);

    return session;
  }

  public start(session: Session): Session {
    assert(
      session.status == SessionStatus.IN_LOBBY,
      "Session can only be started if it's already in lobby!"
    );

    session.status = SessionStatus.ACTIVE;
    this.sessionDAO.save(session);

    return session;
  }

  public find(id: string): Session | undefined {
    return this.sessionDAO.find(id);
  }
}
