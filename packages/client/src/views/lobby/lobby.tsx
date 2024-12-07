import { useState } from "react";
import { renderPage } from "../../pageutils"
import * as QR from 'qrcode';
import { app } from "../../app";
import type { Participant } from "../../participant";

function JoinLobby(props: { sessionId: string }) {
  const linkService = app.items.linkService
  const link = linkService.joinLobby(props.sessionId).toString();
  const [qrData, setQrData] = useState('foo');

  QR.toString(link).then(svg => {
    const encodedData = btoa(svg);
    const dataUrl = `data:image/svg+xml;base64,${encodedData}`;

    setQrData(dataUrl);
  });

  return (
    <div className="lobby__panel">
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
    <div className="lobby__panel">
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
              <td>{participant.isReady ? '✔️' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Lobby(props: { sessionId: string, participants: Array<Participant>}) {
  return (
    <div className="lobby">
      <JoinLobby sessionId={props.sessionId} />
      <LobbyParticipants participants={props.participants}/>
    </div>
  )
}

function LobbyPage() {
  const dungeonClient = app.items.dungeonClient;
  const sessionId = 'Sni3QJme';
  const [participants, setParticipants] = useState<Array<Participant>>([]);

  dungeonClient.onParticipantJoin.add(() => setParticipants(dungeonClient.getParticipants()));
  dungeonClient.onParticipantChange.add(() => setParticipants(dungeonClient.getParticipants()));
  dungeonClient.onParticipantLeave.add(() => setParticipants(dungeonClient.getParticipants()));

  return <Lobby sessionId={sessionId} participants={participants} />;
}

renderPage(<LobbyPage/>, {
  title: 'Dumber Dungeons - Lobby'
});

const dungeonClient = app.items.dungeonClient;
[
  () => dungeonClient.onParticipantJoin.emit( {
    participant: { id: '0000', name: 'Foo', isReady: false }
  }),
  () => dungeonClient.onParticipantJoin.emit({
    participant: { id: '000a', name: 'Bar', isReady: false }
  }),
  () => dungeonClient.onParticipantJoin.emit({
    participant: { id: '0010', name: 'Quix', isReady: false }
  }),

  () => dungeonClient.onParticipantChange.emit({
    participant: { id: '0000', name: 'Foo', isReady: true }
  }),
  () => dungeonClient.onParticipantChange.emit({
    participant: { id: '000a', name: 'Baron', isReady: false }
  }),
  () => dungeonClient.onParticipantChange.emit({
    participant: { id: '0010', name: 'Quix', isReady: true }
  }),
  () => dungeonClient.onParticipantChange.emit({
    participant: { id: '000a', name: 'Baron', isReady: true }
  }),
].forEach((action, idx) => setTimeout(action, (1 + idx) * 1000));
