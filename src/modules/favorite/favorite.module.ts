import { Module } from '@nestjs/common';

import { AlbumModule } from '../album/album.module';
import { ArtistModule } from '../artist/artist.module';
import { AuthModule } from '../auth/auth.module';
import { TrackModule } from '../track/track.module';
import { FavoriteRepository } from './favorite.repository';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';

@Module({
  imports: [AlbumModule, ArtistModule, AuthModule, TrackModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
})
export class FavoriteModule {}
