import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

import { IsNotNull } from '../../../common/decorators';

export class UpdateAlbumDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  year: number;

  @IsUUID('4')
  @IsNotNull()
  artistId: string | null;
}
