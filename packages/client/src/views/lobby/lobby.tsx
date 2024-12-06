import { useState } from "react";
import { renderPage } from "../../pageutils"
import * as QR from 'qrcode';

// TODO: Have a shared type
interface Participant {
  name: string,
  isReady: boolean
};

function JoinLobby(props: { sessionId: string }) {
  const link = `${window.location.origin}/join/${props.sessionId}`;
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
            <tr key={idx}>
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

function Lobby() {
  return (
    <div className="lobby">
      <JoinLobby sessionId="Sni3QJme" />
      <LobbyParticipants participants={[
        {
          name: 'Foo',
          isReady: true
        },
        {
          name: 'Bar',
          isReady: false
        }
      ]}/>
    </div>
  )
}

renderPage(<Lobby/>, {
  title: 'Dumber Dungeons - Lobby'
})
