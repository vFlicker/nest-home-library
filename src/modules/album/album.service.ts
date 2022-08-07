import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { PrismaService } from '../prisma/prisma.service';
import { AlbumEntity } from './entities/album.entity';
import { Message } from './constants/message.constants';
import { CreateAlbumDto, UpdateAlbumDto } from './dto';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    if (Boolean(createAlbumDto.artistId)) {
      const artist = await this.prisma.artist.findUnique({
        where: { id: createAlbumDto.artistId },
      });

      if (!artist) throw new NotFoundException(Message.NOT_FOUND);
    }

    const newAlbum = await this.prisma.album.create({
      data: { ...createAlbumDto },
    });

    return plainToClass(AlbumEntity, newAlbum);
  }

  async findAll(): Promise<AlbumEntity[]> {
    const albums = await this.prisma.album.findMany();
    return albums;
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw new NotFoundException(Message.NOT_FOUND);

    return plainToClass(AlbumEntity, album);
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw new NotFoundException(Message.NOT_FOUND);

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: { ...updateAlbumDto },
    });

    return plainToClass(AlbumEntity, updatedAlbum);
  }

  async remove(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw new NotFoundException(Message.NOT_FOUND);

    await this.prisma.album.delete({ where: { id } });
  }
}
