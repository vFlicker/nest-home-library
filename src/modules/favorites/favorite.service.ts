import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { AlbumEntity } from '../albums/entities/album.entity';
import { ArtistEntity } from '../artists/entities/artist.entity';
import { TrackEntity } from '../tracks/entities/track.entity';
import { TrackService } from '../tracks/track.service';
import { FavoritesEntity } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    private database: DatabaseService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  addAlbum(id: string): AlbumEntity {
    const album = this.database.albums.find((album) => album.id === id);
    if (!album) {
      throw new UnprocessableEntityException(`Album doesn't exist.`);
    }
    this.database.favorites.albums.push(album);

    return album;
  }

  addArtist(id: string): ArtistEntity {
    const artist = this.database.artists.find((artist) => artist.id === id);
    if (!artist) {
      throw new UnprocessableEntityException(`Artist doesn't exist.`);
    }
    this.database.favorites.artists.push(artist);

    return artist;
  }

  addTrack(id: string): TrackEntity {
    const track = this.database.tracks.find((track) => track.id === id);

    if (!track) {
      throw new UnprocessableEntityException(`Track with doesn't exist.`);
    }

    this.database.favorites.tracksIds.push(track.id);
    return track;
  }

  findAll(): FavoritesEntity {
    return {
      albums: this.database.favorites.albums,
      artists: this.database.favorites.artists,
      tracks: this.trackService.findManyByIds(
        this.database.favorites.tracksIds,
      ),
    };
  }

  removeAlbum(id: string): void {
    const album = this.database.favorites.albums.find(
      (album) => album.id === id,
    );
    if (!album) throw new NotFoundException();

    this.database.favorites.albums = this.database.favorites.albums.filter(
      (album) => album.id !== id,
    );
  }

  removeArtist(id: string): void {
    const artist = this.database.favorites.artists.find(
      (artist) => artist.id === id,
    );
    if (!artist) throw new NotFoundException();

    this.database.favorites.artists = this.database.favorites.artists.filter(
      (artist) => artist.id !== id,
    );
  }

  removeTrack(id: string): void {
    const track = this.database.favorites.tracksIds.findIndex(
      (trackId) => trackId === id,
    );

    if (track === -1) throw new NotFoundException();

    this.handleRemoveTrack(id);
  }

  handleRemoveTrack(id: string) {
    this.database.favorites.tracksIds =
      this.database.favorites.tracksIds.filter((trackId) => trackId !== id);
  }
}
