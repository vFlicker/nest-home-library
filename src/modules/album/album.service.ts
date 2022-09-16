import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { errorMessage } from '../../common/utils/error-message';
import { ArtistRepository } from '../artist/artist.repository';
import { AlbumRepository } from './album.repository';
import { AlbumEntity } from './entities/album.entity';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumService {
  constructor(
    private albumRepository: AlbumRepository,
    private artistRepository: ArtistRepository,
  ) {}

  async findOneById(id: string): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOneById(id);

    if (!album) throw new NotFoundException(errorMessage.notFound('Album'));

    return plainToClass(AlbumEntity, album);
  }

  async findAll(): Promise<AlbumEntity[]> {
    const albums = await this.albumRepository.findAll();
    return albums;
  }

  async create(dto: CreateAlbumDto): Promise<AlbumEntity> {
    const { artistId } = dto;

    if (artistId) {
      const artist = await this.artistRepository.findOneById(artistId);
      if (!artist) throw new NotFoundException(errorMessage.notFound('Artist'));
    }

    if (artistId) {
      const artist = await this.artistRepository.findOneById(artistId);
      if (!artist) throw new NotFoundException(errorMessage.notFound('Artist'));
    }

    const album = await this.albumRepository.create(dto);
    return plainToClass(AlbumEntity, album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOneById(id);

    if (!album) throw new NotFoundException(errorMessage.notFound('Album'));

    const updatedAlbum = await this.albumRepository.update(id, dto);
    return plainToClass(AlbumEntity, updatedAlbum);
  }

  async remove(id: string): Promise<void> {
    const album = await this.albumRepository.findOneById(id);

    if (!album) throw new NotFoundException(errorMessage.notFound('Album'));

    await this.albumRepository.remove(id);
  }
}
