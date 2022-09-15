import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { PrismaService } from '../../common/services';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async findOneById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    return user;
  }

  async findOneByLogin(login: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { login } });
    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async create(login: string, password: string): Promise<User> {
    // TODO:
    const createdAt = new Date().toISOString();

    const user = await this.prismaService.user.create({
      data: {
        login,
        password,
        createdAt,
        updatedAt: createdAt,
      },
    });

    return user;
  }

  async updatePassword(id: string, password: string): Promise<User> {
    const updatedAt = new Date().toISOString();

    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        password,
        updatedAt,
        version: { increment: 1 },
      },
    });

    return user;
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: { refreshToken },
    });

    return user;
  }

  async remove(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }
}
