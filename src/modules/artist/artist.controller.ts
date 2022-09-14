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
import { ArtistService } from './artist.service';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { ArtistEntity } from './entities/artist.entity';

@Controller('artist')
@UseGuards(AuthGuard)
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOneById(@Param('id', uuidV4Decorator) id: string): Promise<ArtistEntity> {
    return this.artistService.findOneById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<ArtistEntity[]> {
    return this.artistService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', uuidV4Decorator) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', uuidV4Decorator) id: string): Promise<void> {
    return this.artistService.remove(id);
  }
}
