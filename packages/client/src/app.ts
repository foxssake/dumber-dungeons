import { createContainer } from 'iti';
import { DungeonClient } from './dungeon.client';
import { io } from 'socket.io-client';

// Setup DI context
export const app = createContainer().add({
  dungeonClient: new DungeonClient(io()),
});
