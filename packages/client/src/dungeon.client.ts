import { EventSource } from '@shared/event.source';
import type { Participant } from './participant';
import type { Session } from './session';

interface ParticipantEvent {
  participant: Participant
};

export type ParticipantJoinEvent = ParticipantEvent;
export type ParticipantChangeEvent = ParticipantEvent;
export type ParticipantLeaveEvent = ParticipantEvent;

export type EventHandler<T> = (data: T) => void;

export class DungeonClient extends EventSource {
  private session: Session | undefined;

  public on(event: 'lobby/join', handler: EventHandler<ParticipantJoinEvent>): void;
  public on(event: 'lobby/change', handler: EventHandler<ParticipantChangeEvent>): void;
  public on(event: 'lobby/leave', handler: EventHandler<ParticipantLeaveEvent>): void;
  public on(event: string, handler: Function): void {
    super.on(event, handler);
  }

  public emit(event: 'lobby/join', data: ParticipantJoinEvent): void;
  public emit(event: 'lobby/change', data: ParticipantChangeEvent): void;
  public emit(event: 'lobby/leave', data: ParticipantLeaveEvent): void;
  public emit(event: string, ...data: Array<any>): void {
    super.emit(event, ...data);
  }

  public constructor() {
    super();

    this.session = {
      id: 'todo',
      participants: []
    };

    this.on('lobby/join', data => this.addParticipant(data.participant));
    this.on('lobby/leave', data => this.removeParticipant(data.participant));
    this.on('lobby/change', data => this.updateParticipant(data.participant));
  }

  public getParticipants(): Array<Participant> {
    return [...(this.session?.participants ?? [])];
  }

  private addParticipant(participant: Participant) {
    this.session?.participants.push(participant);
  }

  private removeParticipant(participant: Participant) {
    this.session!.participants = this.session!.participants
      .filter(p => p.id !=participant.id);
  }

  private updateParticipant(participant: Participant) {
    const idx = this.session!.participants.findIndex(p => p.id == participant.id);

    if(idx < 0)
      this.addParticipant(participant);
    else
      this.session!.participants[idx] = participant;
  }
}
