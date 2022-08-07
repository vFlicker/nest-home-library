import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as createId } from 'uuid';

import { DatabaseService } from '../database/database.service';

import { Message } from './constants/message.constants';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';

@Injectable()
export class AlbumService {
  constructor(private readonly database: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto): AlbumEntity {
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

  findOne(id: string): AlbumEntity {
    const album = this.database.albums.find((album) => album.id === id);
    if (!album) throw new NotFoundException(Message.NOT_FOUND);
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): AlbumEntity {
    const album = this.findOne(id);
    Object.assign(album, updateAlbumDto);
    return album;
  }

  remove(id: string): void {
    const album = this.database.albums.find((album) => album.id === id);
    if (!album) throw new NotFoundException(Message.NOT_FOUND);

    for (const track of this.database.tracks) {
      if (track.albumId === id) track.albumId = null;
    }

    this.database.albums = this.database.albums.filter(
      (album) => album.id !== id,
    );

    this.database.favorites.albums = this.database.albums.filter(
      (album) => album.id !== id,
    );
  }
}
