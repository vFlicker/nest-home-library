import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AllExceptionFilter } from './common/filters';
import { LoggerMiddleware } from './common/middlewares';
import {
  AlbumModule,
  ArtistModule,
  AuthModule,
  FavoriteModule,
  GlobalModule,
  TrackModule,
  UserModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AlbumModule,
    ArtistModule,
    AuthModule,
    FavoriteModule,
    GlobalModule,
    TrackModule,
    UserModule,
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
