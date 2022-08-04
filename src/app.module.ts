import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  AlbumModule,
  ArtistModule,
  AuthModule,
  FavoriteModule,
  TrackModule,
  UserModule,
  PrismaModule,
} from './modules';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    FavoriteModule,
    TrackModule,
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
