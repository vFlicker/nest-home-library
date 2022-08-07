import { Exclude, Type } from 'class-transformer';
import { Album, Artist, Track } from '@prisma/client';

import { AlbumEntity } from '../../album/entities/album.entity';
import { ArtistEntity } from '../../artist/entities/artist.entity';
import { TrackEntity } from '../../track/entities/track.entity';

export class FavoriteEntity {
  @Exclude()
  favoriteId: string;

  @Type(() => AlbumEntity)
  albums: Album[];

  @Type(() => ArtistEntity)
  artists: Artist[];

  @Type(() => TrackEntity)
  tracks: Track[];
}
