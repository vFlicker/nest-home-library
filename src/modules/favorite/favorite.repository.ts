import { Injectable } from '@nestjs/common';
import { Album, Artist, Favorite, Track } from '@prisma/client';

import { PrismaService } from '../../common/services';

type FavoriteModel = Favorite & {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
};

@Injectable()
export class FavoriteRepository {
  constructor(private prismaService: PrismaService) {}

  async findOne(): Promise<FavoriteModel> {
    const favorites = await this.prismaService.favorite.findMany();

    if (!favorites.length) {
      await this.prismaService.favorite.create({ data: {} });
    }

    const favorite = await this.prismaService.favorite.findFirst({
      include: {
        albums: true,
        artists: true,
        tracks: true,
      },
    });

    return favorite;
  }

  async getFavoriteId(): Promise<string> {
    const [favorite] = await this.prismaService.favorite.findMany();

    if (!favorite) {
      const { id } = await this.prismaService.favorite.create({ data: {} });
      return id;
    }

    return favorite.id;
  }
}
