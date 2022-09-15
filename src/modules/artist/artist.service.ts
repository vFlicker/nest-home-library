import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { errorMessage } from '../../common/utils/error-message';
import { ArtistRepository } from './artist.repository';
import { ArtistEntity } from './entities/artist.entity';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistService {
  constructor(private artistRepository: ArtistRepository) {}

  async findOneById(id: string): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOneById(id);

    if (!artist) throw new NotFoundException(errorMessage.notFound('Artist'));

    return plainToClass(ArtistEntity, artist);
  }

  async findAll(): Promise<ArtistEntity[]> {
    const artists = await this.artistRepository.findAll();
    return artists.map((artist) => plainToClass(ArtistEntity, artist));
  }

  async create(dto: CreateArtistDto): Promise<ArtistEntity> {
    const artist = await this.artistRepository.create(dto);
    return plainToClass(ArtistEntity, artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<ArtistEntity> {
    const artist = await this.artistRepository.findOneById(id);

    if (!artist) throw new NotFoundException(errorMessage.notFound('Artist'));

    const updatedArtist = await this.artistRepository.update(id, dto);
    return plainToClass(ArtistEntity, updatedArtist);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.artistRepository.findOneById(id);

    if (!artist) throw new NotFoundException(errorMessage.notFound('Artist'));

    await this.artistRepository.remove(id);
  }
}
