import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as createId } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { Message } from './constants/message.constants';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private readonly database: DatabaseService) {}

  create(createArtistDto: CreateArtistDto): ArtistEntity {
    const newArtist = {
      id: createId(),
      ...createArtistDto,
    };

    this.database.artists.push(newArtist);
    return newArtist;
  }

  findAll(): ArtistEntity[] {
    return this.database.artists;
  }

  findOne(id: string): ArtistEntity {
    const artist = this.database.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException(Message.NOT_FOUND);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): ArtistEntity {
    const artist = this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string): void {
    const artist = this.database.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException(Message.NOT_FOUND);

    for (const album of this.database.albums) {
      if (album.artistId === id) album.artistId = null;
    }

    for (const track of this.database.tracks) {
      if (track.artistId === id) track.artistId = null;
    }

    this.database.favorites.artists = this.database.favorites.artists.filter(
      (artist) => artist.id !== id,
    );

    this.database.artists = this.database.artists.filter(
      (artist) => artist.id !== id,
    );
  }
}
