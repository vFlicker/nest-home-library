import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { hash, compare } from 'bcrypt';
import { User } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { Message } from './constants/message.constants';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // TODO: remove and use auth.service.signup
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { login, password } = createUserDto;

    const passwordHash = await hash(password, 10);
    const createdAt = new Date().toISOString();

    const newUser = await this.prisma.user.create({
      data: {
        login,
        password: passwordHash,
        createdAt,
        updatedAt: createdAt,
      },
    });

    return plainToClass(UserEntity, newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => plainToClass(UserEntity, user));
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(Message.NOT_FOUND);

    return plainToClass(UserEntity, user);
  }

  async findByLogin(login: string): Promise<User> {
    // TODO: use findUnique
    const user = await this.prisma.user.findFirst({ where: { login } });

    if (!user) throw new NotFoundException(Message.NOT_FOUND);

    return user;
  }

  async updatePassword(
    id: string,
    { newPassword, oldPassword }: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(Message.NOT_FOUND);

    const passwordMatches = await compare(oldPassword, user.password);
    if (!passwordMatches) throw new ForbiddenException('Forbidden');

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        updatedAt: new Date().toISOString(),
        version: { increment: 1 },
      },
    });

    return plainToClass(UserEntity, updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException(Message.NOT_FOUND);

    await this.prisma.user.delete({ where: { id } });
  }
}
