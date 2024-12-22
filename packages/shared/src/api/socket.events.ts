import type { Participant } from './participant';

type ParticipantEvent = {
  participant: Participant;
};

export type ParticipantJoinEvent = ParticipantEvent;
export type ParticipantChangeEvent = ParticipantEvent;
export type ParticipantLeaveEvent = ParticipantEvent;

interface ParticipantEventMap extends EventMap {
  'participant/join': (participant: Participant) => void;
  'participant/leave': (participant: Participant) => void;
  'participant/update': (participant: Participant) => void;
}

interface SetupEventMap extends EventMap {
  'setup/name': (name: string) => void;
  'setup/ready': (isReady: boolean) => void;
}

export interface SocketEventMap extends ParticipantEventMap, SetupEventMap {};
