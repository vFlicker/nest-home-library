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
  UseGuards,
} from '@nestjs/common';

import { uuidV4Decorator } from '../../common/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';
import { AlbumEntity } from './entities/album.entity';

@Controller('album')
@UseGuards(AuthGuard)
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id', uuidV4Decorator) id: string): Promise<AlbumEntity> {
    return this.albumService.findOneById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<AlbumEntity[]> {
    return this.albumService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAlbumDto): Promise<AlbumEntity> {
    return this.albumService.create(dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', uuidV4Decorator) id: string,
    @Body() dto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    return this.albumService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', uuidV4Decorator) id: string): Promise<void> {
    return this.albumService.remove(id);
  }
}
