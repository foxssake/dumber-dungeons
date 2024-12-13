import { join } from "path";

export default class ContentService {
  constructor (private readonly root: string) {}

  public getStaticAssetRoot(): string {
    return this.root;
  }

  public async serveSPA(): Promise<string> {
    return Bun.file(join(this.root, 'index.html')).text();
  }
}
