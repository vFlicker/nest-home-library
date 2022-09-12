import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { AlbumEntity } from '../albums/entities/album.entity';
import { AlbumService } from '../albums/album.service';
import { ArtistEntity } from '../artists/entities/artist.entity';
import { ArtistService } from '../artists/artist.service';
import { DatabaseService } from '../database/database.service';
import { FavoritesEntity } from './entities/favorite.entity';
import { TrackEntity } from '../tracks/entities/track.entity';
import { TrackService } from '../tracks/track.service';

@Injectable()
export class FavoriteService {
  constructor(
    private database: DatabaseService,

    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,

    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,

    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  addAlbum(id: string): AlbumEntity {
    const album = this.database.albums.find((album) => album.id === id);

    if (!album) {
      throw new UnprocessableEntityException(this.sayNoExist('Album'));
    }

    this.database.favorites.albumIds.push(album.id);
    return album;
  }

  addArtist(id: string): ArtistEntity {
    const artist = this.database.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new UnprocessableEntityException(this.sayNoExist('Artist'));
    }

    this.database.favorites.artistIds.push(artist.id);
    return artist;
  }

  addTrack(id: string): TrackEntity {
    const track = this.database.tracks.find((track) => track.id === id);

    if (!track) {
      throw new UnprocessableEntityException(this.sayNoExist('Track'));
    }

    this.database.favorites.trackIds.push(track.id);
    return track;
  }

  findAll(): FavoritesEntity {
    const { albumIds, artistIds, trackIds } = this.database.favorites;

    return {
      albums: this.albumService.findManyByIds(albumIds),
      artists: this.artistService.findManyByIds(artistIds),
      tracks: this.trackService.findManyByIds(trackIds),
    };
  }

  removeAlbum(id: string): void {
    const albumIndex = this.database.favorites.albumIds.findIndex(
      (albumsId) => albumsId === id,
    );

    if (albumIndex === -1) {
      throw new NotFoundException(this.sayNoExist('Album'));
    }

    this.handleRemoveAlbum(id);
  }

  removeArtist(id: string): void {
    const artistIndex = this.database.favorites.artistIds.findIndex(
      (artistId) => artistId === id,
    );

    if (artistIndex === -1) {
      throw new NotFoundException(this.sayNoExist('Artist'));
    }

    this.handleRemoveArtist(id);
  }

  removeTrack(id: string): void {
    const track = this.database.favorites.trackIds.findIndex(
      (trackId) => trackId === id,
    );

    if (track === -1) {
      throw new NotFoundException(this.sayNoExist('Track'));
    }

    this.handleRemoveTrack(id);
  }

  handleRemoveAlbum(id: string) {
    this.database.favorites.albumIds = this.database.favorites.albumIds.filter(
      (albumId) => albumId !== id,
    );
  }

  handleRemoveArtist(id: string) {
    this.database.favorites.artistIds =
      this.database.favorites.artistIds.filter((artistId) => artistId !== id);
  }

  handleRemoveTrack(id: string) {
    this.database.favorites.trackIds = this.database.favorites.trackIds.filter(
      (trackId) => trackId !== id,
    );
  }

  private sayNoExist(name: string) {
    return `${name} with doesn't exist.`;
  }
}
