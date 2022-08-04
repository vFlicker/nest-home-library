import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { v4 as uuid } from 'uuid';

import { Message } from '../user/constants/message.constants';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto';
import { SignupDto } from './dto/signup.dto';
import { TokenPair } from './interfaces/token-pair.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<UserEntity> {
    const user = await this.userService.create(signupDto);
    return user;
  }

  async login(loginDto: LoginDto): Promise<TokenPair> {
    const user = await this.userService.findOneByLogin(loginDto.login);

    if (!compareSync(loginDto.password, user.password)) {
      throw new NotFoundException(Message.NOT_FOUND);
    }

    const tokenPair = await this.issueTokenPair(user.id);
    return tokenPair;
  }

  private async issueTokenPair(userId: string): Promise<TokenPair> {
    const secret = this.config.get('JWT_SECRET_KEY');
    console.log();

    const token = await this.jwt.signAsync(
      { id: userId },
      {
        expiresIn: '15m',
        secret,
      },
    );
    const refreshToken = uuid();

    /* TODO: store refresh token in database */

    return { token, refreshToken };
  }
}
