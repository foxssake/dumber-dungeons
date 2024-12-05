import { describe, it, expect, beforeEach } from 'bun:test';
import { SessionStatus, type Session } from 'src/session/session';
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
    it('should create session', () => {
      // Given
      const expected: Session = {
        id: '0000',
        status: SessionStatus.IN_LOBBY,
        participants: [],
      };

      // When
      const actual = sessionService.create();

      // Then
      expect(actual).toEqual(expected);
      expect(sessionDao.save.calledWith(expected)).toBeTrue();
    });
  });

  describe('start', () => {
    it('should start session', () => {
      // Given
      const session: Session = {
        id: '0000',
        status: SessionStatus.IN_LOBBY,
        participants: [],
      };

      // When
      const result = sessionService.start(session);

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
    it('should return known session', () => {
      // Given
      const expected = sessionService.create();
      sessionDao.find.returns(expected);

      // When
      const actual = sessionService.find(expected.id);

      // Then
      expect(actual).toBe(expected);
      expect(sessionDao.find.calledWith(expected.id)).toBeTrue();
    });

    it('should return undefined on unknown session', () => {
      // When
      const result = sessionService.find('0000');

      // Then
      expect(result).toBeUndefined();
    });
  });
});
