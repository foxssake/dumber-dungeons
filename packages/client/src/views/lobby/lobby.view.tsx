import type { Participant } from '@dumber-dungeons/shared/src/api/participant';
import { verify } from '@dumber-dungeons/shared/src/verify';
import { LobbyParticipants } from './lobby.participants';
import { JoinLobby } from './join.lobby.pane';
import { app } from '#src/app';
import { useState, type JSX } from 'react';
import { useParams } from 'react-router';

export function LobbyView(): JSX.Element {
  const dungeonClient = app.items.dungeonClient;
  const sessionId = useParams().id;
  verify(sessionId, 'Missing session ID!');

  const [participants, setParticipants] = useState<Array<Participant>>([]);

  const refreshParticipants = (): void => {
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
