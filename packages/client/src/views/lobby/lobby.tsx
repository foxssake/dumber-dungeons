import type { Participant } from '@dumber-dungeons/shared/src/api/participant';
import { LobbyParticipants } from './lobby.participants';
import { JoinLobby } from './join.lobby.pane';
import { app } from '#src/app';
import { useState } from 'react';

export function LobbyPage() {
  const dungeonClient = app.items.dungeonClient;
  const sessionId = app.items.linkService.parseLobby(
    new URL(window.location.href)
  );
  if (!sessionId) throw new Error('Missing sessionId!');

  const [participants, setParticipants] = useState<Array<Participant>>([]);

  const refreshParticipants = () => {
    setParticipants(dungeonClient.getParticipants());
  };
  dungeonClient.onParticipantJoin.add(refreshParticipants);
  dungeonClient.onParticipantChange.add(refreshParticipants);
  dungeonClient.onParticipantLeave.add(refreshParticipants);

  return (
    <div className="lobby main">
      <JoinLobby sessionId={sessionId} />
      <LobbyParticipants participants={participants} />
    </div>
  );
}
