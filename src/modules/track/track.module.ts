import { Module } from '@nestjs/common';

import { AlbumModule } from '../album/album.module';
import { ArtistModule } from '../artist/artist.module';
import { AuthModule } from '../auth/auth.module';
import { TrackController } from './track.controller';
import { TrackRepository } from './track.repository';
import { TrackService } from './track.service';

@Module({
  imports: [AlbumModule, ArtistModule, AuthModule],
  controllers: [TrackController],
  providers: [TrackService, TrackRepository],
  exports: [TrackRepository],
})
export class TrackModule {}
