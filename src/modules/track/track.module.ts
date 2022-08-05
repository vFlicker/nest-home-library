import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';

@Module({
  imports: [AuthModule],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
