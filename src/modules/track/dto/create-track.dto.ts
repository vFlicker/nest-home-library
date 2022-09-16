import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

import { IsNotNull } from '../../../common/decorators';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID('4')
  @IsNotNull()
  artistId: string | null;

  @IsUUID('4')
  @IsNotNull()
  albumId: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
