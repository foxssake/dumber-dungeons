import { EventEmitter } from '@dumber-dungeons/shared/src/event.emitter';
import {
  type Session,
  SessionStatus,
} from '@dumber-dungeons/shared/src/api/session';
import { type Participant } from '@dumber-dungeons/shared/src/api/participant';
import {
  type ParticipantChangeEvent,
  type ParticipantJoinEvent,
  type ParticipantLeaveEvent,
  type SocketEventMap,
} from '@dumber-dungeons/shared/src/api/socket.events';
import type { Socket } from 'socket.io-client';

export class DungeonClient {
  public readonly onParticipantJoin = new EventEmitter<ParticipantJoinEvent>();
  public readonly onParticipantChange =
    new EventEmitter<ParticipantChangeEvent>();
  public readonly onParticipantLeave =
    new EventEmitter<ParticipantLeaveEvent>();
  private session: Session;
  private socket: Socket<SocketEventMap>;

  constructor(socket: Socket) {
    this.socket = socket;

    this.session = {
      id: '',
      status: SessionStatus.IN_LOBBY,
      participants: [],
    };

    this.subscribeToSocket();
  }

  public getParticipants(): Array<Participant> {
    return [...this.session.participants];
  }

  public setName(name: string): void {
    this.socket.emit('setup/name', name);
  }

  public setReady(isReady: boolean): void {
    this.socket.emit('setup/ready', isReady);
  }

  private subscribeToSocket(): void {
    this.socket.on('participant/join', (participant: Participant) => {
      this.addParticipant(participant);
      this.onParticipantJoin.emit({ participant });
    });
    this.socket.on('participant/update', (participant: Participant) => {
      this.updateParticipant(participant);
      this.onParticipantChange.emit({ participant });
    });
    this.socket.on('participant/leave', (participant: Participant) => {
      this.removeParticipant(participant);
      this.onParticipantLeave.emit({ participant });
    });
  }

  private addParticipant(participant: Participant): void {
    this.session.participants.push(participant);
  }

  private removeParticipant(participant: Participant): void {
    this.session.participants = this.session.participants.filter(
      (p) => p.id != participant.id
    );
  }

  private updateParticipant(participant: Participant): void {
    const idx = this.session.participants.findIndex(
      (p) => p.id == participant.id
    );

    if (idx < 0) this.addParticipant(participant);
    else this.session.participants[idx] = participant;
  }
}
