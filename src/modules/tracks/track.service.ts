import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as createId } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { FavoriteService } from '../favorites/favorite.service';
import { Message } from './constants/message.constants';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    private database: DatabaseService,
    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,
  ) {}

  create(createTrackDto: CreateTrackDto): TrackEntity {
    const newTrack = {
      id: createId(),
      ...createTrackDto,
    };

    this.database.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.database.tracks;
  }

  findOneById(id: string) {
    const track = this.database.tracks.find((track) => track.id === id);

    if (!track) throw new NotFoundException(Message.NOT_FOUND);

    return track;
  }

  findManyByIds(ids: string[]): TrackEntity[] {
    const tracks = this.database.tracks.filter(({ id }) => ids.includes(id));
    return tracks;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findOneById(id);
    Object.assign(track, updateTrackDto);
    return track;
  }

  remove(id: string) {
    const trackIndex = this.database.tracks.findIndex(
      (track) => track.id === id,
    );

    if (trackIndex === -1) throw new NotFoundException(Message.NOT_FOUND);

    this.database.tracks.splice(trackIndex, 1);
    this.favoriteService.handleRemoveTrack(id);
  }

  handleRemoveAlbumFromTrack(id: string) {
    const tracks = this.findAll();

    for (const track of tracks) {
      if (track.albumId === id) track.albumId = null;
    }
  }

  handleRemoveArtistFromTrack(id: string) {
    const tracks = this.findAll();

    for (const track of tracks) {
      if (track.artistId === id) track.artistId = null;
    }
  }
}
