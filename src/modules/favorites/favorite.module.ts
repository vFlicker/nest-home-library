import { forwardRef, Module } from '@nestjs/common';

import { AlbumModule } from '../albums/album.module';
import { ArtistModule } from '../artists/artist.module';
import { DatabaseModule } from '../database/database.module';
import { TrackModule } from '../tracks/track.module';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => ArtistModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
