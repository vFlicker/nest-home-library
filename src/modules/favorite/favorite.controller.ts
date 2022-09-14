import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Album, Artist, Track } from '@prisma/client';

import { uuidV4Decorator } from '../../common/decorators';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FavoriteEntity } from './entities/favorite.entity';
import { FavoriteService } from './favorite.service';

@Controller('favs')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<FavoriteEntity> {
    return this.favoriteService.findAll();
  }

  @Post('/album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbum(@Param('id', uuidV4Decorator) id: string): Promise<Album> {
    return this.favoriteService.addAlbum(id);
  }

  @Post('/artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtist(@Param('id', uuidV4Decorator) id: string): Promise<Artist> {
    return this.favoriteService.addArtist(id);
  }

  @Post('/track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrack(@Param('id', uuidV4Decorator) id: string): Promise<Track> {
    return this.favoriteService.addTrack(id);
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', uuidV4Decorator) id: string): Promise<void> {
    return this.favoriteService.removeAlbum(id);
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', uuidV4Decorator) id: string): Promise<void> {
    return this.favoriteService.removeArtist(id);
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', uuidV4Decorator) id: string): Promise<void> {
    return this.favoriteService.removeTrack(id);
  }
}
