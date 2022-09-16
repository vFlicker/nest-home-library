import { Injectable } from '@nestjs/common';
import { Album } from '@prisma/client';

import { PrismaService } from '../../common/services';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumRepository {
  constructor(private prismaService: PrismaService) {}

  async findOneById(id: string): Promise<Album> {
    const album = await this.prismaService.album.findUnique({ where: { id } });
    return album;
  }

  async findAll(): Promise<Album[]> {
    const albums = await this.prismaService.album.findMany();
    return albums;
  }

  async create(data: CreateAlbumDto): Promise<Album> {
    const album = await this.prismaService.album.create({ data });
    return album;
  }

  async addToFavorite(albumId: string, favoriteId: string): Promise<Album> {
    const album = await this.prismaService.album.update({
      where: { id: albumId },
      data: { favoriteId },
    });

    return album;
  }

  async update(id: string, data: UpdateAlbumDto): Promise<Album> {
    const album = await this.prismaService.album.update({
      where: { id },
      data,
    });

    return album;
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.album.delete({ where: { id } });
  }

  async removeFromFavorite(albumId: string): Promise<void> {
    await this.prismaService.album.update({
      where: { id: albumId },
      data: { favoriteId: null },
    });
  }
}
