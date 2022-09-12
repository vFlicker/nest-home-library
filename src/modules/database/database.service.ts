import { Injectable } from '@nestjs/common';

import { AlbumEntity } from '../albums/entities/album.entity';
import { ArtistEntity } from '../artists/entities/artist.entity';
import { TrackEntity } from '../tracks/entities/track.entity';
import { UserEntity } from '../users/entities/user.entity';

type Favorites = {
  albums: AlbumEntity[];
  artists: ArtistEntity[];
  tracksIds: string[];
};

@Injectable()
export class DatabaseService {
  albums: AlbumEntity[] = [];
  artists: ArtistEntity[] = [];
  favorites: Favorites = {
    albums: [],
    artists: [],
    tracksIds: [],
  };
  tracks: TrackEntity[] = [];
  users: UserEntity[] = [];

  private static instance;

  constructor() {
    if (!DatabaseService.instance) DatabaseService.instance = this;
    return DatabaseService.instance;
  }
}
