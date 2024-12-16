import { describe, it, expect, beforeEach } from 'bun:test';
import { SessionStatus, type Session } from '@dumber-dungeons/shared/src/api';
import { createStubInstance, type SinonStubbedInstance } from 'sinon';
import { SessionDAO } from 'src/session/session.dao';
import { SessionService } from 'src/session/session.service';
import { IDGenerator } from 'src/utils/id.generator';

describe('SessionService', () => {
  let sessionDao: SinonStubbedInstance<SessionDAO>;
  let idGenerator: SinonStubbedInstance<IDGenerator>;
  let sessionService: SessionService;

  beforeEach(() => {
    sessionDao = createStubInstance(SessionDAO);

    idGenerator = createStubInstance(IDGenerator, {
      forSession: '0000',
    });

    sessionService = new SessionService(sessionDao, idGenerator);
  });

  describe('create', () => {
    it('should create session', async () => {
      // Given
      const expected: Session = {
        id: '0000',
        status: SessionStatus.IN_LOBBY,
        participants: [],
      };

      // When
      const actual = await sessionService.create();

      // Then
      expect(actual).toEqual(expected);
      expect(sessionDao.save.calledWith(expected)).toBeTrue();
    });
  });

  describe('start', () => {
    it('should start session', async () => {
      // Given
      const session: Session = {
        id: '0000',
        status: SessionStatus.IN_LOBBY,
        participants: [],
      };

      // When
      const result = await sessionService.start(session);

      // Then
      expect(result.status).toBe(SessionStatus.ACTIVE);
      expect(sessionDao.save.calledWith(result)).toBeTrue();
    });

    it('should not start non-lobby session', () => {
      // Given
      const session: Session = {
        id: '0000',
        status: SessionStatus.ACTIVE,
        participants: [],
      };

      // When + Then
      expect(() => sessionService.start(session)).toThrow();
    });
  });

  describe('find', () => {
    it('should return known session', async () => {
      // Given
      const expected = await sessionService.create();
      sessionDao.find.returns(Promise.resolve(expected));

      // When
      const actual = await sessionService.find(expected.id);

      // Then
      expect(actual).toBe(expected);
      expect(sessionDao.find.calledWith(expected.id)).toBeTrue();
    });

    it('should return undefined on unknown session', async () => {
      // When
      const result = await sessionService.find('0000');

      // Then
      expect(result).toBeUndefined();
    });
  });
});
