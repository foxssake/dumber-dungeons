import { Style } from "#src/components/style";
import { useState } from "react";
import viewStyle from "./style.css";

export function ParticipantSetupView() {
  const [isReady, setReady] = useState<boolean>();

  return (
    <>
      <Style href={viewStyle} />
      <div className="setup main">
        <p>Your name:</p>
        <input type="text" />
        <p>Ready?</p>
        <button
          onClick={() => setReady(!isReady)}
          className={"setup ready" + (isReady ? ' active' : '')}>
            {isReady ? '✓' : '✗'}
        </button>
      </div>
    </>
  )
}
