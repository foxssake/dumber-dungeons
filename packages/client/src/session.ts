import type { Participant } from './participant';

// TODO: Grab from some shared source
export interface Session {
  id: string;
  participants: Array<Participant>;
}
