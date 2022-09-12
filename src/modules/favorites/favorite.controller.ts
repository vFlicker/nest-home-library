import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { uuidV4Decorator } from '../../common';
import { AlbumEntity } from '../albums/entities/album.entity';
import { ArtistEntity } from '../artists/entities/artist.entity';
import { TrackEntity } from '../tracks/entities/track.entity';
import { FavoriteService } from './favorite.service';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('/album/:id')
  addAlbum(@Param('id', uuidV4Decorator) id: string): AlbumEntity {
    return this.favoriteService.addAlbum(id);
  }

  @Post('/artist/:id')
  addArtist(@Param('id', uuidV4Decorator) id: string): ArtistEntity {
    return this.favoriteService.addArtist(id);
  }

  @Post('/track/:id')
  addTrack(@Param('id', uuidV4Decorator) id: string): TrackEntity {
    return this.favoriteService.addTrack(id);
  }

  @Get()
  findAll() {
    return this.favoriteService.findAll();
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbum(@Param('id', uuidV4Decorator) id: string) {
    return this.favoriteService.removeAlbum(id);
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtist(@Param('id', uuidV4Decorator) id: string) {
    return this.favoriteService.removeArtist(id);
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrack(@Param('id', uuidV4Decorator) id: string) {
    return this.favoriteService.removeTrack(id);
  }
}
