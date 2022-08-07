import { AlbumEntity } from '../../albums/entities/album.entity';
import { ArtistEntity } from '../../artists/entities/artist.entity';
import { TrackEntity } from '../../tracks/entities/track.entity';

export interface FavoritesEntity {
  albums: AlbumEntity[];
  artists: ArtistEntity[];
  tracks: TrackEntity[];
}
