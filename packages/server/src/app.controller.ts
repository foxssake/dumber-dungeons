import { Controller, Get, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';

const DIST_ROOT = join(__dirname, '../../../dist/')

@Controller()
export class AppController {
  @Get()
  public getRoot(): StreamableFile {
    return new StreamableFile(
      createReadStream(join(DIST_ROOT, '/index.html')),
      { type: 'text/html' }
    )
  }

  @Get('threejs')
  public getThreejs(): StreamableFile {
    return new StreamableFile(
      createReadStream(join(DIST_ROOT, '/threejs.html')),
      { type: 'text/html' }
    )
  }
}
