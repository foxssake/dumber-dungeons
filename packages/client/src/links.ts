import { generatePath } from 'react-router';

export function generateLink(path: string, params: object): string {
  const resultURL = new URL(window.location.href);
  resultURL.pathname = generatePath(path, params);

  return resultURL.toString();
}
