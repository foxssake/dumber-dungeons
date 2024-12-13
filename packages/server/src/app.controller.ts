import { Controller, Get } from '@nestjs/common';
import ContentService from './content.service';

@Controller()
export class AppController {
  constructor(
    private readonly contentService: ContentService
  ) {}

  @Get()
  public getIndex(): Promise<string> {
    return this.contentService.serveSPA();
  }
}
