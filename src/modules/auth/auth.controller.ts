import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { PublicRoute } from '../../common/decorators';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, SignupDto } from './dto';
import { TokenPair } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @PublicRoute()
  signup(@Body() dto: SignupDto): Promise<UserEntity> {
    return this.authService.signup(dto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  login(@Body() dto: LoginDto): Promise<TokenPair> {
    return this.authService.login(dto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() dto: RefreshDto): Promise<TokenPair> {
    return this.authService.refresh(dto);
  }
}
