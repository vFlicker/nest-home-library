import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as createId } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { Message } from './constants/message.constants';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(private readonly database: DatabaseService) {}

  create(createTrackDto: CreateTrackDto): TrackEntity {
    const newTrack = {
      id: createId(),
      ...createTrackDto,
    };

    this.database.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): TrackEntity[] {
    return this.database.tracks;
  }

  findOne(id: string): TrackEntity {
    const track = this.database.tracks.find((track) => track.id === id);
    if (!track) throw new NotFoundException(Message.NOT_FOUND);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): TrackEntity {
    const track = this.findOne(id);
    Object.assign(track, updateTrackDto);
    return track;
  }

  remove(id: string): void {
    const track = this.database.tracks.find((track) => track.id === id);
    if (!track) throw new NotFoundException(Message.NOT_FOUND);

    this.database.favorites.tracks = this.database.favorites.tracks.filter(
      (track) => track.id !== id,
    );

    this.database.tracks = this.database.tracks.filter(
      (track) => track.id !== id,
    );
  }
}
