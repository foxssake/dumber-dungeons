export class LinkService {
  constructor(private readonly root: URL) {}

  public joinLobby(sessionId: string): URL {
    return new URL(`${this.root}join/${sessionId}`);
  }

  public parseLobby(url: URL): string | undefined {
    const parts = url.pathname.split('/').slice(1);

    if (parts.length < 2 || parts[0] !== 'lobby') return undefined;

    return parts[1];
  }
}
