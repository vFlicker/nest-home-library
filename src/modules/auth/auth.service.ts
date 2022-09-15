import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { plainToClass } from 'class-transformer';

import { PrismaService } from '../../common/services';
import { errorMessage } from '../../common/utils';
import { UserEntity } from '../user/entities/user.entity';
import { LoginDto, RefreshDto } from './dto';
import { SignupDto } from './dto/signup.dto';
import { TokenPair, TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async signup(signupDto: SignupDto): Promise<UserEntity> {
    const { login, password } = signupDto;

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

  async login(loginDto: LoginDto): Promise<TokenPair> {
    const { login, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    const passwordMatches = await argon.verify(user.password, password);
    if (!passwordMatches) throw new ForbiddenException(errorMessage.forbidden);

    const tokenPair = await this.issueTokenPair(user.id, user.login);
    return tokenPair;
  }

  async refresh(refreshDto: RefreshDto): Promise<TokenPair> {
    const { login } = this.verifyRefreshToken(refreshDto.refreshToken);

    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshDto.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new ForbiddenException(errorMessage.forbidden);
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
