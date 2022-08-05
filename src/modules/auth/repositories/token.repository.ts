import { Injectable } from '@nestjs/common';
import { Token } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(userId: string, refreshToken: string): Promise<void> {
    await this.prisma.token.upsert({
      where: { userId },
      update: { refreshToken },
      create: { userId, refreshToken },
    });
  }

  async find(userId: string): Promise<Token> {
    const response = await this.prisma.token.findFirst({
      where: { userId },
    });

    return response;
  }
}
