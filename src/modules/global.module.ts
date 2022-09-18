import { Global, Logger, Module } from '@nestjs/common';

import { PrismaService } from '../common/services';

@Global()
@Module({
  providers: [Logger, PrismaService],
  exports: [Logger, PrismaService],
})
export class GlobalModule {}
