import { Exclude, Transform } from 'class-transformer';

export class UserEntity {
  id: string;
  login: string;

  @Exclude()
  password: string;

  version: number;

  @Transform(({ value }) => new Date(value).getTime())
  createdAt: number;

  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: number;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
