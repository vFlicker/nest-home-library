import { Injectable } from '@nestjs/common';
import { Artist } from '@prisma/client';

import { PrismaService } from '../../common/services';
import { CreateArtistDto, UpdateArtistDto } from './dto';

@Injectable()
export class ArtistRepository {
  constructor(private prismaService: PrismaService) {}

  async findOneById(id: string): Promise<Artist> {
    const artist = await this.prismaService.artist.findUnique({
      where: { id },
    });

    return artist;
  }

  async findAll(): Promise<Artist[]> {
    const artists = await this.prismaService.artist.findMany();
    return artists;
  }

  async create(data: CreateArtistDto): Promise<Artist> {
    const artist = await this.prismaService.artist.create({ data });
    return artist;
  }

  async addToFavorite(artistId: string, favoriteId: string): Promise<Artist> {
    const artist = await this.prismaService.artist.update({
      where: { id: artistId },
      data: { favoriteId },
    });

    return artist;
  }

  async update(id: string, data: UpdateArtistDto): Promise<Artist> {
    const artist = await this.prismaService.artist.update({
      where: { id },
      data,
    });

    return artist;
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.artist.delete({ where: { id } });
  }

  async removeFromFavorite(artistId: string): Promise<void> {
    await this.prismaService.artist.update({
      where: { id: artistId },
      data: { favoriteId: null },
    });
  }
}
