import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { errorMessage } from '../../common/utils';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { LoginDto, RefreshDto, SignupDto } from './dto';
import { TokenPair, TokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    private userRepository: UserRepository,
  ) {}

  async signup(dto: SignupDto): Promise<UserEntity> {
    const user = await this.userService.create(dto);
    return user;
  }

  async login(dto: LoginDto): Promise<TokenPair> {
    const { login } = dto;

    const user = await this.userRepository.findOneByLogin(login);

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    const isPasswordMatches = await argon.verify(user.password, dto.password);

    if (!isPasswordMatches) {
      throw new ForbiddenException(errorMessage.forbidden);
    }

    const tokenPair = await this.issueTokenPair({ id: user.id, login });
    return tokenPair;
  }

  async refresh(dto: RefreshDto): Promise<TokenPair> {
    const { refreshToken } = dto;

    const tokenPayload = await this.verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findOneByLogin(tokenPayload.login);

    if (!user) throw new NotFoundException(errorMessage.notFound('User'));

    const refreshTokenMatches = await argon.verify(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException(errorMessage.forbidden);
    }

    const tokenPair = await this.issueTokenPair(tokenPayload);
    return tokenPair;
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      const secret = this.configService.get('JWT_SECRET_KEY');
      const tokenPayload = await this.jwtService.verifyAsync(token, { secret });
      return tokenPayload;
    } catch {
      throw new ForbiddenException(errorMessage.forbidden);
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const secret = this.configService.get('JWT_SECRET_REFRESH_KEY');
      const tokenPayload = await this.jwtService.verifyAsync(token, { secret });
      return tokenPayload;
    } catch {
      throw new ForbiddenException(errorMessage.forbidden);
    }
  }

  private async issueTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const { id } = payload;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
        secret: this.configService.get('JWT_SECRET_KEY'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
        secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      }),
    ]);

    const hashedRefreshToken = await argon.hash(refreshToken);

    await this.userRepository.updateRefreshToken(id, hashedRefreshToken);

    return { accessToken, refreshToken };
  }
}
