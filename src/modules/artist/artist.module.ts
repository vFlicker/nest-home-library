import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ArtistController } from './artist.controller';
import { ArtistRepository } from './artist.repository';
import { ArtistService } from './artist.service';

@Module({
  imports: [AuthModule],
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
  exports: [ArtistRepository],
})
export class ArtistModule {}
