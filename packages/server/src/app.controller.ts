import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ViewService } from './view.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly viewService: ViewService
  ) {}

  @Get()
  public getHello(): string {
    return this.appService.getHello();
  }

  @Get('/threejs')
  public getThreejs(): Promise<string> {
    return this.viewService.render('threejs');
  }
}
