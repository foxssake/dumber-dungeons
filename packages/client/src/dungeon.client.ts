import { EventEmitter } from '@shared/event.emitter';
import type { Participant } from './participant';
import type { Session } from './session';
import type { Socket } from 'socket.io-client';

interface ParticipantEvent {
  participant: Participant;
}

export type ParticipantJoinEvent = ParticipantEvent;
export type ParticipantChangeEvent = ParticipantEvent;
export type ParticipantLeaveEvent = ParticipantEvent;

export class DungeonClient {
  public readonly onParticipantJoin =
    new EventEmitter<ParticipantJoinEvent>();
  public readonly onParticipantChange =
    new EventEmitter<ParticipantChangeEvent>();
  public readonly onParticipantLeave =
    new EventEmitter<ParticipantLeaveEvent>();

  private session: Session;
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;

    this.session = {
      id: '',
      participants: [],
    };

    this.subscribeToSocket();
    this.subscribeToEvents();
  }

  public getParticipants(): Array<Participant> {
    return [...this.session.participants];
  }

  private subscribeToSocket(): void {
    this.socket.on('participant/join', (participant: Participant) => this.onParticipantJoin.emit({ participant }));
    this.socket.on('participant/update', (participant: Participant) => this.onParticipantChange.emit({ participant }));
    this.socket.on('participant/leave', (participant: Participant) => this.onParticipantLeave.emit({ participant }));
  }

  private subscribeToEvents(): void {
    this.onParticipantJoin.add((event) => {
      this.addParticipant(event.participant);
    });
    this.onParticipantChange.add((event) => {
      this.updateParticipant(event.participant);
    });
    this.onParticipantLeave.add((event) => {
      this.removeParticipant(event.participant);
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
