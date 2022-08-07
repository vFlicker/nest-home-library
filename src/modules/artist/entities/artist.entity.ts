import { Exclude } from 'class-transformer';

export class ArtistEntity {
  id: string;
  name: string;
  grammy: boolean;

  @Exclude()
  favoriteId: string;
}
