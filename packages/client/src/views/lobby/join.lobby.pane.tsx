import { useEffect, useState, type JSX } from 'react';
import * as QR from 'qrcode';
import { frontendRoutes } from '@dumber-dungeons/shared/src/api/frontend.routes';
import { generateLink } from '#src/links';

export function JoinLobby(props: { sessionId: string }): JSX.Element {
  const [link, setLink] = useState<string>();
  const [qrData, setQrData] = useState<string>();

  useEffect(() => {
    const joinLink = generateLink(frontendRoutes.join, { id: props.sessionId });

    setLink(joinLink);
    void QR.toDataURL(joinLink, { width: 512 }).then(setQrData);
  }, [props.sessionId]);

  return (
    <div className="lobby panel">
      <p>
        <img src={qrData} />
      </p>
      <p>
        Join at: <i>{link}</i>
      </p>
    </div>
  );
}
