import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { FavoriteModule } from '../favorites/favorite.module';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TrackModule } from '../tracks/track.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => FavoriteModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
