import { Style } from "#src/components/style";
import { useState, type ChangeEvent, type ChangeEventHandler } from "react";
import viewStyle from "./style.css";
import { app } from "#src/app";

function NameInput(props: { onChange: (name: string) => void }) {
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  }

  return (
    <input type="text" onChange={changeHandler}/>
  );
}

function ReadyButton(props: { onChange: (isReady: boolean) => void }) {
  const [isReady, setReady] = useState<boolean>();

  const clickHandler = () => {
    setReady(!isReady);
    props.onChange(isReady ?? false);
  };

  return (
    <button
      onClick={clickHandler}
      className={"setup ready" + (isReady ? ' active' : '')}>
        {isReady ? '✓' : '✗'}
    </button>
  );
}

export function ParticipantSetupView() {
  const dungeonClient = app.items.dungeonClient;

  return (
    <>
      <Style href={viewStyle} />
      <div className="setup main">
        <p>Your name:</p>
        <NameInput onChange={name => dungeonClient.setName(name)} />
        <p>Ready?</p>
        <ReadyButton onChange={isReady => dungeonClient.setReady(isReady)} />
      </div>
    </>
  )
}
