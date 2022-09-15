import { Global, Module } from '@nestjs/common';

import { LoggingService, PrismaService } from '../common/services';
import { CustomLogger } from '../common/utils';

@Global()
@Module({
  providers: [CustomLogger, LoggingService, PrismaService],
  exports: [CustomLogger, PrismaService],
})
export class GlobalModule {}
