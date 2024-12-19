import { Controller, Get, Optional } from '@nestjs/common';
import { indexPath as defaultIndexPath } from './root.paths';
import { frontendRoutes } from '@dumber-dungeons/shared/src/api/frontend.routes';

@Controller()
export class FrontendController {
  constructor(
    @Optional() private readonly indexPath: string = defaultIndexPath
  ) {}

  @Get(Object.values(frontendRoutes))
  public async serveFrontend(): Promise<string> {
    return Bun.file(this.indexPath).text();
  }
}
