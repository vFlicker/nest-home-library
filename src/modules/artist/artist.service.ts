import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';
import { Message } from './constants/message.constants';
import { CreateArtistDto, UpdateArtistDto } from './dto';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    const newArtist = await this.prisma.artist.create({
      data: { ...createArtistDto },
    });

    return plainToClass(ArtistEntity, newArtist);
  }

  async findAll(): Promise<ArtistEntity[]> {
    const artists = await this.prisma.artist.findMany();
    return artists.map((artist) => plainToClass(ArtistEntity, artist));
  }

  async findOne(id: string): Promise<ArtistEntity> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) throw new NotFoundException(Message.NOT_FOUND);

    return plainToClass(ArtistEntity, artist);
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) throw new NotFoundException(Message.NOT_FOUND);

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: { ...updateArtistDto },
    });

    return plainToClass(ArtistEntity, updatedArtist);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) throw new NotFoundException(Message.NOT_FOUND);

    await this.prisma.artist.delete({ where: { id } });
  }
}
