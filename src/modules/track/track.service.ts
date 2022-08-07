import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';
import { Message } from './constants/message.constants';
import { CreateTrackDto, UpdateTrackDto } from './dto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    if (Boolean(createTrackDto.albumId)) {
      const album = await this.prisma.album.findUnique({
        where: { id: createTrackDto.albumId },
      });

      if (!album) throw new NotFoundException(Message.NOT_FOUND);
    }

    if (Boolean(createTrackDto.artistId)) {
      const artist = await this.prisma.artist.findUnique({
        where: { id: createTrackDto.artistId },
      });

      if (!artist) throw new NotFoundException(Message.NOT_FOUND);
    }

    const newTrack = await this.prisma.track.create({
      data: { ...createTrackDto },
    });

    return plainToClass(TrackEntity, newTrack);
  }

  async findAll(): Promise<TrackEntity[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks.map((track) => plainToClass(TrackEntity, track));
  }

  async findOne(id: string): Promise<TrackEntity> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) throw new NotFoundException(Message.NOT_FOUND);

    return plainToClass(TrackEntity, track);
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) throw new NotFoundException(Message.NOT_FOUND);

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: { ...updateTrackDto },
    });

    return plainToClass(TrackEntity, updatedTrack);
  }

  async remove(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) throw new NotFoundException(Message.NOT_FOUND);

    await this.prisma.track.delete({ where: { id } });
  }
}
