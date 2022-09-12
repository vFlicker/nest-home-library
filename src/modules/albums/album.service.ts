import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as createId } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { FavoriteService } from '../favorites/favorite.service';
import { TrackService } from '../tracks/track.service';
import { Message } from './constants/message.constants';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(
    private database: DatabaseService,

    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,

    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: createId(),
      ...createAlbumDto,
    };
    this.database.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): AlbumEntity[] {
    return this.database.albums;
  }

  findManyByIds(ids: string[]): AlbumEntity[] {
    const albums = this.database.albums.filter(({ id }) => ids.includes(id));
    return albums;
  }

  findOneById(id: string) {
    const album = this.database.albums.find((album) => album.id === id);

    if (!album) throw new NotFoundException(Message.NOT_FOUND);

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOneById(id);
    Object.assign(album, updateAlbumDto);
    return album;
  }

  remove(id: string) {
    const albumIndex = this.database.albums.findIndex(
      (album) => album.id === id,
    );

    if (albumIndex === -1) throw new NotFoundException(Message.NOT_FOUND);

    this.database.albums.splice(albumIndex, 1);

    this.trackService.handleRemoveAlbumFromTrack(id);
    this.favoriteService.handleRemoveAlbum(id);
  }

  handleRemoveArtistFromAlbum(id: string) {
    const albums = this.findAll();

    for (const album of albums) {
      if (album.artistId === id) album.artistId = null;
    }
  }
}
