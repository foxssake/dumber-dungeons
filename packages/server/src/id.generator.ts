import { Injectable } from "@nestjs/common";
import { nanoid } from "nanoid";

@Injectable()
export class IDGenerator {
  public forSession(): string {
    return nanoid(8);
  }
}
