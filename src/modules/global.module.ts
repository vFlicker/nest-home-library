import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

import { AllExceptionFilter } from '../common/filters';
import { PrismaService } from '../common/services';
import { loggerLevels } from '../common/utils';

const transports = [
  new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  new winston.transports.File({ filename: 'logs/combined.log' }),
] as any;

if (process.env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(),
      ),
    }),
  );
}

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    WinstonModule.forRoot({
      level: loggerLevels[process.env.LOGGER_LEVEL],
      transports,
    }),
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
    Logger,
    PrismaService,
  ],
  exports: [Logger, PrismaService],
})
export class GlobalModule {}
