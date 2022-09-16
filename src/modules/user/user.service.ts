import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import * as argon from 'argon2';

import { errorMessage } from '../../common/utils';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneById(id);

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    return plainToClass(UserEntity, user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => plainToClass(UserEntity, user));
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const { login, password } = dto;

    const passwordHash = await argon.hash(password);

    const user = await this.userRepository.create(login, passwordHash);
    return plainToClass(UserEntity, user);
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const { oldPassword, newPassword } = dto;

    const user = await this.userRepository.findOneById(id);

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    const isPasswordMatches = await argon.verify(user.password, oldPassword);

    if (!isPasswordMatches) {
      throw new ForbiddenException(errorMessage.forbidden);
    }

    const newHashedPassword = await argon.hash(newPassword);

    const updatedUser = await this.userRepository.updatePassword(
      id,
      newHashedPassword,
    );

    return plainToClass(UserEntity, updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOneById(id);

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    await this.userRepository.remove(id);
  }
}
