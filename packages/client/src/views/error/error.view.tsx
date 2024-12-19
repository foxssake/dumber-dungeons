import type { JSX } from 'react';

export function ErrorView(props: { error: Error }): JSX.Element {
  return (
    <>
      <h1>Error - {props.error.message}</h1>
      <p>Stack trace:</p>
      <pre>{String(props.error.stack)}</pre>
    </>
  );
}
