import type { Participant } from "./participant";

export enum SessionStatus {
  IN_LOBBY,
  ACTIVE,
}

export interface Session {
  id: string;
  status: SessionStatus;
  participants: Array<Participant>;
}
