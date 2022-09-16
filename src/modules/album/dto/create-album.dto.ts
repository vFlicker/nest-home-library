import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

import { IsNotNull } from '../../../common/decorators';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsUUID('4')
  @IsNotNull()
  artistId: string | null;
}
