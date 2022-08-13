import { Module } from '@nestjs/common';

import { CustomLogger } from '../../common/utils';
import { LoggingService } from './logging.service';

@Module({
  providers: [CustomLogger, LoggingService],
  exports: [CustomLogger],
})
export class LoggingModule {}
