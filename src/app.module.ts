import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { utilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AllExceptionFilter } from './common/filters';
import { AuthGuard } from './common/guards/auth.guard';

import { LoggerMiddleware } from './common/middlewares';
import { loggerLevels } from './common/utils';
import {
  AlbumModule,
  ArtistModule,
  AuthModule,
  FavoriteModule,
  GlobalModule,
  TrackModule,
  UserModule,
} from './modules';

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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    WinstonModule.forRoot({
      level: loggerLevels[process.env.LOGGER_LEVEL],
      transports,
    }),

    GlobalModule,

    AlbumModule,
    ArtistModule,
    AuthModule,
    FavoriteModule,
    TrackModule,
    UserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: AllExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
