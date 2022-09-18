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

import { uuidV4Decorator } from '../../common/decorators';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { TrackEntity } from './entities/track.entity';
import { TrackService } from './track.service';

@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id', uuidV4Decorator) id: string): Promise<TrackEntity> {
    return this.trackService.findOneById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<TrackEntity[]> {
    return this.trackService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTrackDto): Promise<TrackEntity> {
    return this.trackService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', uuidV4Decorator) id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    return this.trackService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', uuidV4Decorator) id: string): Promise<void> {
    return this.trackService.remove(id);
  }
}
