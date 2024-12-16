import type { Participant } from '@dumber-dungeons/shared/src/api';
import { LobbyParticipants } from './lobby.participants';
import { JoinLobby } from './join.lobby.pane';
import { app } from '#src/app';
import { useState } from 'react';

function Lobby(props: { sessionId: string, participants: Array<Participant>}) {
  return (
    <div className="lobby main">
      <JoinLobby sessionId={props.sessionId} />
      <LobbyParticipants participants={props.participants}/>
    </div>
  );
}

export function LobbyPage() {
  const dungeonClient = app.items.dungeonClient;
  const sessionId = 'Sni3QJme';
  const [participants, setParticipants] = useState<Array<Participant>>([]);

  const refreshParticipants = () => { setParticipants(dungeonClient.getParticipants()); };
  dungeonClient.onParticipantJoin.add(refreshParticipants);
  dungeonClient.onParticipantChange.add(refreshParticipants);
  dungeonClient.onParticipantLeave.add(refreshParticipants);

  return <Lobby sessionId={sessionId} participants={participants} />;
}
