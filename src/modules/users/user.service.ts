import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as createId } from 'uuid';

import { DatabaseService } from '../database/database.service';
import { Message } from './constants/message.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  create(createUserDto: CreateUserDto): UserEntity {
    const newUser = new UserEntity({
      id: createId(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...createUserDto,
    });

    this.database.users.push(newUser);
    return newUser;
  }

  findAll(): UserEntity[] {
    return this.database.users;
  }

  findOne(id: string): UserEntity {
    const user = this.database.users.find((user) => user.id === id);
    if (!user) throw new NotFoundException(Message.NOT_FOUND);
    return user;
  }

  updatePassword(
    id: string,
    { newPassword, oldPassword }: UpdatePasswordDto,
  ): UserEntity {
    const user = this.findOne(id);

    if (user.password !== oldPassword) {
      throw new ForbiddenException(Message.WRONG_PASSWORD);
    }

    user.password = newPassword;
    user.version++;
    user.updatedAt = Date.now();

    return user;
  }

  remove(id: string): void {
    const index = this.database.users.findIndex((user) => user.id === id);
    if (index === -1) throw new NotFoundException(Message.NOT_FOUND);
    this.database.users.splice(index, 1);
  }
}
