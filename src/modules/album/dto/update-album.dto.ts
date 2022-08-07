import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

const IsNotNull = () => ValidateIf((_, value) => value !== null);

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
