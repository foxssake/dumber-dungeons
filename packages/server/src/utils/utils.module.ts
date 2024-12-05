import { Module } from '@nestjs/common';
import { IDGenerator } from './id.generator';

@Module({
  providers: [IDGenerator],
  exports: [IDGenerator]
})
export class UtilsModule {}
