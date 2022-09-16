import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConsoleLoggerOptions } from '@nestjs/common/services/console-logger.service';
import { ConfigService } from '@nestjs/config';

import { LoggingService } from '../../services';
import { getLogLevels } from './get-log-levels';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private loggingService: LoggingService;

  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    configService: ConfigService,
    LoggingService: LoggingService,
  ) {
    super(context, {
      ...options,
      logLevels: getLogLevels(configService.get('NODE_ENV') === 'production'),
    });

    this.loggingService = LoggingService;
  }

  async log(message: string, context?: string) {
    super.log.apply(this, [message, context]);

    await this.loggingService.createLog({
      message,
      context,
      level: 'log',
    });
  }

  async error(message: string, stack?: string, context?: string) {
    super.error.apply(this, [message, stack, context]);

    await this.loggingService.createLog({
      message,
      context,
      level: 'error',
    });
  }

  async warn(message: string, context?: string) {
    super.warn.apply(this, [message, context]);

    await this.loggingService.createLog({
      message,
      context,
      level: 'warn',
    });
  }

  async debug(message: string, context?: string) {
    super.debug.apply(this, [message, context]);

    await this.loggingService.createLog({
      message,
      context,
      level: 'debug',
    });
  }

  async verbose(message: string, context?: string) {
    super.verbose.apply(this, [message, context]);

    await this.loggingService.createLog({
      message,
      context,
      level: 'verbose',
    });
  }
}
