import { useState } from "react";
import * as QR from 'qrcode';
import { app } from "../../app";
import type { Participant } from "../../participant";

function JoinLobby(props: { sessionId: string }) {
  const linkService = app.items.linkService
  const link = linkService.joinLobby(props.sessionId).toString();
  const [qrData, setQrData] = useState<string>();

  QR.toDataURL(link, { width: 512 }).then(setQrData);

  return (
    <div className="lobby panel">
      <p>
        <img src={qrData} />
      </p>
      <p>
        Join at: <a href={link}>{link}</a>
      </p>
    </div>
  )
}

function LobbyParticipants(props: { participants: Array<Participant> }) {
  return (
    <div className="lobby panel">
      Participants
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>Ready?</td>
          </tr>
        </thead>
        <tbody>
          {props.participants.map((participant, idx) => (
            <tr key={participant.id}>
              <td>#{idx + 1}</td>
              <td>{participant.name}</td>
              <td>{participant.isReady ? '✅' : '❎'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Lobby(props: { sessionId: string, participants: Array<Participant>}) {
  return (
    <div className="lobby main">
      <JoinLobby sessionId={props.sessionId} />
      <LobbyParticipants participants={props.participants}/>
    </div>
  )
}

export function LobbyPage() {
  const dungeonClient = app.items.dungeonClient;
  const sessionId = 'Sni3QJme';
  const [participants, setParticipants] = useState<Array<Participant>>([]);

  const refreshParticipants = () => setParticipants(dungeonClient.getParticipants());
  dungeonClient.onParticipantJoin.add(refreshParticipants);
  dungeonClient.onParticipantChange.add(refreshParticipants);
  dungeonClient.onParticipantLeave.add(refreshParticipants);

  return <Lobby sessionId={sessionId} participants={participants} />;
}
