import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Artist, Track } from '@prisma/client';
import { plainToClass } from 'class-transformer';

import { errorMessage } from '../../common/utils';
import { AlbumRepository } from '../album/album.repository';
import { AlbumEntity } from '../album/entities/album.entity';
import { ArtistRepository } from '../artist/artist.repository';
import { TrackRepository } from '../track/track.repository';
import { FavoriteEntity } from './entities/favorite.entity';
import { FavoriteRepository } from './favorite.repository';

@Injectable()
export class FavoriteService {
  constructor(
    private albumRepository: AlbumRepository,
    private artistRepository: ArtistRepository,
    private favoriteRepository: FavoriteRepository,
    private trackRepository: TrackRepository,
  ) {}

  async findOne(): Promise<FavoriteEntity> {
    const favorite = this.favoriteRepository.findOne();
    return plainToClass(FavoriteEntity, favorite);
  }

  async addAlbum(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOneById(id);

    if (!album) {
      throw new UnprocessableEntityException(
        errorMessage.notExistence('Album'),
      );
    }

    const favoriteId = await this.favoriteRepository.getFavoriteId();

    await this.albumRepository.addToFavorite(id, favoriteId);
    return plainToClass(AlbumEntity, album);
  }

  async addArtist(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOneById(id);

    if (!artist) {
      throw new UnprocessableEntityException(
        errorMessage.notExistence('Artist'),
      );
    }

    const favoriteId = await this.favoriteRepository.getFavoriteId();

    await this.artistRepository.addToFavorite(id, favoriteId);
    return artist;
  }

  async addTrack(id: string): Promise<Track> {
    const track = await this.trackRepository.findOneById(id);

    if (!track) {
      throw new UnprocessableEntityException(
        errorMessage.notExistence('Track'),
      );
    }

    const favoriteId = await this.favoriteRepository.getFavoriteId();

    await this.trackRepository.addToFavorite(id, favoriteId);
    return track;
  }

  async removeAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findOneById(id);

    if (!album) {
      throw new NotFoundException(errorMessage.notExistence('Album'));
    }

    await this.albumRepository.removeFromFavorite(id);
  }

  async removeArtist(id: string): Promise<void> {
    const artist = await this.artistRepository.findOneById(id);

    if (!artist) {
      throw new NotFoundException(errorMessage.notExistence('Artist'));
    }

    await this.artistRepository.removeFromFavorite(id);
  }

  async removeTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findOneById(id);

    if (!track) {
      throw new NotFoundException(errorMessage.notExistence('Track'));
    }

    await this.trackRepository.removeFromFavorite(id);
  }
}
