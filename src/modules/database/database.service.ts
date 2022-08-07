import { Injectable } from '@nestjs/common';

import { AlbumEntity } from 'src/modules/albums/entities/album.entity';
import { ArtistEntity } from '../artists/entities/artist.entity';
import { FavoritesEntity } from '../favorites/entities/favorite.entity';
import { TrackEntity } from '../tracks/entities/track.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class DatabaseService {
  albums: AlbumEntity[] = [];
  tracks: TrackEntity[] = [];
  artists: ArtistEntity[] = [];
  users: UserEntity[] = [];
  favorites: FavoritesEntity = {
    albums: [],
    tracks: [],
    artists: [],
  };

  private static instance;

  constructor() {
    if (!DatabaseService.instance) DatabaseService.instance = this;
    return DatabaseService.instance;
  }
}
