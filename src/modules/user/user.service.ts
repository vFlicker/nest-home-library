import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from '@prisma/client';
import * as argon from 'argon2';

import { PrismaService } from '../../common/services';
import { errorMessage } from '../../common/utils';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    return plainToClass(UserEntity, user);
  }

  async findByLogin(login: string): Promise<User> {
    // TODO: use findUnique
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => plainToClass(UserEntity, user));
  }

  // TODO: remove and use auth.service.signup
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { login, password } = createUserDto;

    const passwordHash = await argon.hash(password);
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

  async updatePassword(
    id: string,
    { newPassword, oldPassword }: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    const passwordMatches = await argon.verify(user.password, oldPassword);
    if (!passwordMatches) throw new ForbiddenException(errorMessage.forbidden);

    const hashedNewPassword = await argon.hash(newPassword);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedNewPassword,
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

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    await this.prisma.user.delete({ where: { id } });
  }
}
