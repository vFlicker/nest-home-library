import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as createId } from 'uuid';
import { AlbumService } from '../albums/album.service';

import { DatabaseService } from '../database/database.service';
import { FavoriteService } from '../favorites/favorite.service';
import { TrackService } from '../tracks/track.service';
import { Message } from './constants/message.constants';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';

@Injectable()
export class ArtistService {
  constructor(
    private readonly database: DatabaseService,

    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,

    @Inject(forwardRef(() => FavoriteService))
    private favoriteService: FavoriteService,

    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  create(createArtistDto: CreateArtistDto): ArtistEntity {
    const newArtist = {
      id: createId(),
      ...createArtistDto,
    };

    this.database.artists.push(newArtist);
    return newArtist;
  }

  findAll(): ArtistEntity[] {
    return this.database.artists;
  }

  findManyByIds(ids: string[]): ArtistEntity[] {
    const artists = this.database.artists.filter(({ id }) => ids.includes(id));
    return artists;
  }

  findOneById(id: string): ArtistEntity {
    const artist = this.database.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException(Message.NOT_FOUND);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): ArtistEntity {
    const artist = this.findOneById(id);
    Object.assign(artist, updateArtistDto);
    return artist;
  }

  remove(id: string): void {
    const artistIndex = this.database.artists.findIndex(
      (artist) => artist.id === id,
    );

    if (artistIndex === -1) throw new NotFoundException(Message.NOT_FOUND);

    this.database.artists.splice(artistIndex, 1);

    this.albumService.handleRemoveArtistFromAlbum(id);
    this.trackService.handleRemoveArtistFromTrack(id);
    this.favoriteService.handleRemoveArtist(id);
  }
}
