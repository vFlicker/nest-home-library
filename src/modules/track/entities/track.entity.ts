import { Exclude } from 'class-transformer';

export class TrackEntity {
  id: string;
  name: string;
  duration: number;
  albumId: string | null;
  artistId: string | null;

  @Exclude()
  favoriteId: string;
}
