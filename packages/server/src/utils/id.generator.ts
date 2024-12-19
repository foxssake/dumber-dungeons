import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class IDGenerator {
  public forSession(): string {
    return nanoid(8);
  }

  public forParticipant(): string {
    return nanoid(12);
  }

  public forAuth(): string {
    return nanoid(32);
  }
}
