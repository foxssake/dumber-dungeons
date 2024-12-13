import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import ContentService from './content.service';

@Injectable()
export default class SPAMiddleware implements NestMiddleware {
  constructor(private readonly contentService: ContentService) {}

  public async use(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (this.isSPAPath(req.path)) {
      res.status(200);
      res.send(await this.contentService.serveSPA());
      return;
    }

    next();
  }

  private isSPAPath(path: string): boolean {
    return path === '/';
  }
}
