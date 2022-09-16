import { Module } from '@nestjs/common';

import { ArtistModule } from '../artist/artist.module';
import { AuthModule } from '../auth/auth.module';
import { AlbumController } from './album.controller';
import { AlbumRepository } from './album.repository';
import { AlbumService } from './album.service';

@Module({
  imports: [AuthModule, ArtistModule],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository],
  exports: [AlbumRepository],
})
export class AlbumModule {}
