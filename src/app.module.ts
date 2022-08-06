import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerMiddleware } from './common/middlewares';
import {
  AlbumModule,
  ArtistModule,
  AuthModule,
  FavoriteModule,
  PrismaModule,
  TrackModule,
  UserModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AlbumModule,
    ArtistModule,
    AuthModule,
    FavoriteModule,
    PrismaModule,
    TrackModule,
    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
