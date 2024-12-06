import { createContainer } from 'iti';
import { LinkService } from './link.service';

// Setup DI context
export const app = createContainer()
  .add({ linkService: new LinkService(new URL(window.location.origin)) });

