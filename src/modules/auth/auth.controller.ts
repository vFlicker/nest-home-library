import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, SignupDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { TokenPair } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto): Promise<UserEntity> {
    return this.authService.signup(signupDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto): Promise<TokenPair> {
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  refresh(@Body() refreshDto: RefreshDto): Promise<TokenPair> {
    return this.authService.refresh(refreshDto);
  }
}
