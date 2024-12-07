import { EventEmitter } from '@shared/event.emitter';
import type { Participant } from './participant';
import type { Session } from './session';

interface ParticipantEvent {
  participant: Participant;
}

export type ParticipantJoinEvent = ParticipantEvent;
export type ParticipantChangeEvent = ParticipantEvent;
export type ParticipantLeaveEvent = ParticipantEvent;

export type EventHandler<T> = (data: T) => void;

export class DungeonClient {
  private session: Session;

  public readonly onParticipantJoin = new EventEmitter<ParticipantJoinEvent>();
  public readonly onParticipantChange = new EventEmitter<ParticipantChangeEvent>();
  public readonly onParticipantLeave = new EventEmitter<ParticipantLeaveEvent>();

  constructor() {
    this.session = {
      id: 'todo',
      participants: [],
    };

    this.onParticipantJoin.add(event => {this.addParticipant(event.participant);});
    this.onParticipantChange.add(event => {this.updateParticipant(event.participant);});
    this.onParticipantLeave.add(event => {this.removeParticipant(event.participant);});
  }

  public getParticipants(): Array<Participant> {
    return [...this.session.participants];
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
