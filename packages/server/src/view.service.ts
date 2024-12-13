import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class ViewService {
  constructor(@Inject('VIEWS_ROOT') private readonly viewsRoot: string) {}

  public async render(view: string): Promise<string> {
    try {
      return await Bun.file(join(this.viewsRoot, `${view}.html`)).text();
    } catch (e) {
      console.error('Failed to read view file', join(this.viewsRoot, `${view}.html`), e);
      throw e;
    }
  }
}
