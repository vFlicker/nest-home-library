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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto): ArtistEntity {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll(): ArtistEntity[] {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', uuidV4Decorator) id: string): ArtistEntity {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', uuidV4Decorator) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): ArtistEntity {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', uuidV4Decorator) id: string): void {
    return this.artistService.remove(id);
  }
}
