import { Exclude } from 'class-transformer';

export class AlbumEntity {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  @Exclude()
  favoriteId: string;
}
