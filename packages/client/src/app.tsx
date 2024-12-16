import { createContainer } from 'iti';
import { LinkService } from './link.service';
import { DungeonClient } from './dungeon.client';
import { io } from 'socket.io-client';
import { Router } from './router';
import { LobbyPage } from './views/lobby/lobby';
import { ThreeJS } from './views/threejs/threejs';
import globalStyle from './views/style.css';

// Setup DI context
export const app = createContainer()
  .add({ linkService: new LinkService(new URL(window.location.origin)) })
  .add({ dungeonClient: new DungeonClient(io()) })
  .add({ router: new Router()
    .withGlobalStylesheet(globalStyle)
    .withRoute('/', (<ThreeJS />), { title: 'Dumber Dungeons' })
    .withRoute('/lobby', (<LobbyPage />), { title: 'Dumber Dungeons - Lobby' })
  });
