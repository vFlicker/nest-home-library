import { Injectable } from '@nestjs/common';

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
}
