import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

const IsNotNull = () => ValidateIf((_, value) => value !== null);

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
