import { useState, type ChangeEvent, type JSX } from 'react';
import viewStyle from './style.css';
import { app } from '#src/app';
import { ExternalStyle } from '#src/components/external.style';

function NameInput(props: { onChange: (name: string) => void }): JSX.Element {
  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    props.onChange(event.target.value);
  };

  return <input type="text" onChange={changeHandler} />;
}

function ReadyButton(props: {
  onChange: (isReady: boolean) => void;
}): JSX.Element {
  const [isReady, setReady] = useState<boolean>();

  const clickHandler = (): void => {
    setReady(!isReady);
    props.onChange(isReady ?? false);
  };

  return (
    <button
      onClick={clickHandler}
      className={`setup ready ${isReady ? 'active' : ''}`}
    >
      {isReady ? '✓' : '✗'}
    </button>
  );
}

export function ParticipantSetupView(): JSX.Element {
  const dungeonClient = app.items.dungeonClient;

  return (
    <>
      <ExternalStyle href={viewStyle} />
      <div className="setup main">
        <p>Your name:</p>
        <NameInput
          onChange={(name) => {
            dungeonClient.setName(name);
          }}
        />
        <p>Ready?</p>
        <ReadyButton
          onChange={(isReady) => {
            dungeonClient.setReady(isReady);
          }}
        />
      </div>
    </>
  );
}
