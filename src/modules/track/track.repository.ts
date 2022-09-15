import { Injectable } from '@nestjs/common';
import { Track } from '@prisma/client';

import { PrismaService } from '../../common/services';
import { CreateTrackDto, UpdateTrackDto } from './dto';

@Injectable()
export class TrackRepository {
  constructor(private prismaService: PrismaService) {}

  async findOneById(id: string): Promise<Track> {
    const track = await this.prismaService.track.findUnique({
      where: { id },
    });

    return track;
  }

  async findAll(): Promise<Track[]> {
    const tracks = await this.prismaService.track.findMany();
    return tracks;
  }

  async create(data: CreateTrackDto): Promise<Track> {
    const track = await this.prismaService.track.create({ data });
    return track;
  }

  async addToFavorite(trackId: string, favoriteId: string): Promise<Track> {
    const track = await this.prismaService.track.update({
      where: { id: trackId },
      data: { favoriteId },
    });

    return track;
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    const track = await this.prismaService.track.update({
      where: { id },
      data,
    });

    return track;
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.track.delete({ where: { id } });
  }

  async removeFromFavorite(trackId: string): Promise<void> {
    await this.prismaService.track.update({
      where: { id: trackId },
      data: { favoriteId: null },
    });
  }
}
