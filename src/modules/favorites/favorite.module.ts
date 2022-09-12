import { Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { TrackModule } from '../tracks/track.module';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';

@Module({
  imports: [DatabaseModule, TrackModule],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
