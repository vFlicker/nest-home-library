import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module';
import { FavoriteModule } from '../favorites/favorite.module';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

@Module({
  imports: [DatabaseModule, forwardRef(() => FavoriteModule)],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
