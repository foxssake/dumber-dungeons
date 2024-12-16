import { useEffect, useState } from 'react';
import * as QR from 'qrcode';
import { app } from '../../app';

export function JoinLobby(props: { sessionId: string }) {
  const linkService = app.items.linkService;
  const [link, setLink] = useState<string>();
  const [qrData, setQrData] = useState<string>();

  useEffect(() => {
    const newLink = linkService.joinLobby(props.sessionId).toString();

    setLink(newLink);
    QR.toDataURL(newLink, { width: 512 }).then(setQrData);
  }, [props.sessionId]);

  return (
    <div className="lobby panel">
      <p>
        <img src={qrData} />
      </p>
      <p>
        Join at: <a href={link}>{link}</a>
      </p>
    </div>
  );
}

