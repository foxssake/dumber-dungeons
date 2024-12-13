import { Controller, Get } from '@nestjs/common';
import { ViewService } from './view.service';

@Controller()
export class AppController {
  constructor(
    private readonly viewService: ViewService
  ) {}

  @Get()
  public getIndex(): Promise<string> {
    return this.viewService.render('index');
  }
}
