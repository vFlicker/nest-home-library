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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto): AlbumEntity {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll(): AlbumEntity[] {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', uuidV4Decorator) id: string): AlbumEntity {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', uuidV4Decorator) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ): AlbumEntity {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', uuidV4Decorator) id: string): void {
    return this.albumService.remove(id);
  }
}
