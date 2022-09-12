import { forwardRef, Module } from '@nestjs/common';

import { AlbumModule } from '../albums/album.module';
import { DatabaseModule } from '../database/database.module';
import { FavoriteModule } from '../favorites/favorite.module';
import { TrackModule } from '../tracks/track.module';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AlbumModule),
    forwardRef(() => FavoriteModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
