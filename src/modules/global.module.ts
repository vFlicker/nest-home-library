import { Global, Module } from '@nestjs/common';

import { CustomLogger } from 'src/common/utils';
import { LoggingService, PrismaService } from '../common/services';

@Global()
@Module({
  providers: [CustomLogger, LoggingService, PrismaService],
  exports: [CustomLogger, PrismaService],
})
export class GlobalModule {}
