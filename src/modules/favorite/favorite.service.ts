import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Artist, Track } from '@prisma/client';
import { plainToClass } from 'class-transformer';

import { AlbumEntity } from '../album/entities/album.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Message } from './constants/message.constants';
import { FavoriteEntity } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async addAlbum(id: string): Promise<AlbumEntity> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new UnprocessableEntityException(Message.NOT_EXISTENCE('Album'));
    }

    const favoriteId = await this.getFavoriteId();
    await this.prisma.album.update({
      where: { id },
      data: { favoriteId },
    });

    return plainToClass(AlbumEntity, album);
  }

  async addArtist(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new UnprocessableEntityException(Message.NOT_EXISTENCE('Artist'));
    }

    const favoriteId = await this.getFavoriteId();
    await this.prisma.artist.update({
      where: { id },
      data: { favoriteId },
    });

    return artist;
  }

  async addTrack(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new UnprocessableEntityException(Message.NOT_EXISTENCE('Track'));
    }

    const favoriteId = await this.getFavoriteId();
    await this.prisma.track.update({
      where: { id },
      data: { favoriteId },
    });

    return track;
  }

  async findAll(): Promise<FavoriteEntity> {
    const favorites = await this.prisma.favorite.findMany();

    if (!favorites.length) await this.prisma.favorite.create({ data: {} });

    const favorite = await this.prisma.favorite.findFirst({
      include: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });

    return plainToClass(FavoriteEntity, favorite);
  }

  async removeAlbum(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw new NotFoundException();

    await this.prisma.album.update({
      where: { id },
      data: { favoriteId: null },
    });
  }

  async removeArtist(id: string): Promise<void> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) throw new NotFoundException();

    await this.prisma.artist.update({
      where: { id },
      data: { favoriteId: null },
    });
  }

  async removeTrack(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) throw new NotFoundException();

    await this.prisma.track.update({
      where: { id },
      data: { favoriteId: null },
    });
  }

  private async getFavoriteId(): Promise<string> {
    const favorites = await this.prisma.favorite.findMany();

    if (!favorites.length) {
      const favorite = await this.prisma.favorite.create({ data: {} });
      return favorite.id;
    }

    return favorites[0].id;
  }
}
