import { renderPage } from "../../pageutils"

// TODO: Have a shared type
interface Participant {
  name: string,
  isReady: boolean
};

function JoinLobby(props: { sessionId: string }) {
  const link = `${window.location.origin}/join/${props.sessionId}`;

  return (
    <div className="lobby__panel">
      <p>
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" />
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
          <td>#</td>
          <td>Name</td>
          <td>Ready?</td>
        </thead>
        <tbody>
          {props.participants.map((participant, idx) => (
            <tr>
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
