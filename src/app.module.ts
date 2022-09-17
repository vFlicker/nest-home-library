import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

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
    GlobalModule,

    AlbumModule,
    ArtistModule,
    AuthModule,
    FavoriteModule,
    TrackModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
