import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { Message } from '../user/constants/message.constants';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto, RefreshDto } from './dto';
import { SignupDto } from './dto/signup.dto';
import { TokenPair, TokenPayload } from './interfaces';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async signup(signupDto: SignupDto): Promise<UserEntity> {
    const user = await this.userService.create(signupDto);
    return user;
  }

  async login(loginDto: LoginDto): Promise<TokenPair> {
    const user = await this.userService.findByLogin(loginDto.login);

    const passwordMatches = await argon.verify(
      user.password,
      loginDto.password,
    );
    if (!passwordMatches) throw new ForbiddenException(Message.FORBIDDEN);

    const tokenPair = await this.issueTokenPair(user.id, user.login);
    return tokenPair;
  }

  async refresh(refreshDto: RefreshDto): Promise<TokenPair> {
    const tokenPayload = this.verifyRefreshToken(refreshDto.refreshToken);

    const user = await this.userService.findByLogin(tokenPayload.login);

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshDto.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException(Message.FORBIDDEN);
    }

    const tokenPair = await this.issueTokenPair(user.id, user.login);
    return tokenPair;
  }

  // TODO: user verifyAsync
  verifyAccessToken(token: string): TokenPayload {
    try {
      return this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET_KEY'),
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  // TODO: user verifyAsync
  verifyRefreshToken(token: string): TokenPayload {
    try {
      return this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET_REFRESH_KEY'),
      });
    } catch {
      throw new ForbiddenException();
    }
  }

  private async issueTokenPair(
    userId: string,
    login: string,
  ): Promise<TokenPair> {
    const payload = {
      id: userId,
      login,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: this.config.get('TOKEN_EXPIRE_TIME'),
        secret: this.config.get('JWT_SECRET_KEY'),
      }),
      this.jwt.signAsync(payload, {
        expiresIn: this.config.get('TOKEN_REFRESH_EXPIRE_TIME'),
        secret: this.config.get('JWT_SECRET_REFRESH_KEY'),
      }),
    ]);

    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedRefreshToken },
    });

    return { accessToken, refreshToken };
  }
}
