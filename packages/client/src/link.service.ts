export class LinkService {
  constructor(private readonly root: URL) {}

  public joinLobby(sessionId: string): URL {
    return new URL(`${this.root}join/${sessionId}`);
  }
}
