import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class ViewService {
  constructor(@Inject('VIEWS_ROOT') private readonly viewsRoot: string) {}

  public async render(view: string): Promise<string> {
    return Bun.file(join(this.viewsRoot, `${view}.html`)).text();
  }
}
