import { createContainer } from 'iti';
import { LinkService } from './link.service';
import { DungeonClient } from './dungeon.client';

// Setup DI context
export const app = createContainer()
  .add({ linkService: new LinkService(new URL(window.location.origin)) })
  .add({ dungeonClient: new DungeonClient() });
