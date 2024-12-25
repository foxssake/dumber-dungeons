import { useEffect, type JSX } from 'react';

/**
 * Component to include a stylesheet.
 *
 * Can be used from anywhere in the DOM tree, will always append to <head>.
 */
export function ExternalStyle(props: { href: string }): JSX.Element {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = props.href;
    document.head.appendChild(link);

    return (): void => {
      link.remove();
    };
  }, [props.href]);

  return <></>;
}
