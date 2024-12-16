import { Injectable } from '@nestjs/common';
import { BaseDAO } from 'src/base.dao';
import type { Session } from '@dumber-dungeons/shared/src/api';

@Injectable()
export class SessionDAO extends BaseDAO<Session, string> {}
