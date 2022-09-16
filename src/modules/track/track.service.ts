import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { errorMessage } from '../../common/utils/error-message';
import { AlbumRepository } from '../album/album.repository';
import { ArtistRepository } from '../artist/artist.repository';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { TrackEntity } from './entities/track.entity';
import { TrackRepository } from './track.repository';

@Injectable()
export class TrackService {
  constructor(
    private albumRepository: AlbumRepository,
    private artistRepository: ArtistRepository,
    private trackRepository: TrackRepository,
  ) {}

  async findOneById(id: string): Promise<TrackEntity> {
    const track = await this.trackRepository.findOneById(id);

    if (!track) throw new NotFoundException(errorMessage.notFound('Track'));

    return plainToClass(TrackEntity, track);
  }

  async findAll(): Promise<TrackEntity[]> {
    const tracks = await this.trackRepository.findAll();
    return tracks.map((track) => plainToClass(TrackEntity, track));
  }

  async create(dto: CreateTrackDto): Promise<TrackEntity> {
    const { albumId, artistId } = dto;

    if (albumId) {
      const album = await this.albumRepository.findOneById(albumId);
      if (!album) throw new NotFoundException(errorMessage.notFound('Album'));
    }

    if (artistId) {
      const artist = await this.artistRepository.findOneById(artistId);
      if (!artist) throw new NotFoundException(errorMessage.notFound('Artist'));
    }

    const newTrack = await this.trackRepository.create(dto);
    return plainToClass(TrackEntity, newTrack);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<TrackEntity> {
    const track = await this.trackRepository.findOneById(id);

    if (!track) throw new NotFoundException(errorMessage.notFound('Track'));

    const updatedTrack = await this.trackRepository.update(id, dto);
    return plainToClass(TrackEntity, updatedTrack);
  }

  async remove(id: string): Promise<void> {
    const track = await this.trackRepository.findOneById(id);

    if (!track) throw new NotFoundException(errorMessage.notFound('Track'));

    await this.trackRepository.remove(id);
  }
}
