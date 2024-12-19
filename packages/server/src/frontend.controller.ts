import { Controller, Get, Optional } from '@nestjs/common';
import { indexPath as defaultIndexPath } from './root.paths';
// TODO: Fix in #43
// eslint-disable-next-line no-restricted-imports
import { frontendRoutes } from '../../shared/src/api/endpoints';

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
