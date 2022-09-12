import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { uuidV4Decorator } from '../../common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto): TrackEntity {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll(): TrackEntity[] {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', uuidV4Decorator) id: string): TrackEntity {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', uuidV4Decorator) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ): TrackEntity {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', uuidV4Decorator) id: string): void {
    return this.trackService.remove(id);
  }
}
