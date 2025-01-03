import type { Participant } from '@dumber-dungeons/shared/src/api/participant';
import type { JSX } from 'react';

export function LobbyParticipants(props: {
  participants: Array<Participant>;
}): JSX.Element {
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
