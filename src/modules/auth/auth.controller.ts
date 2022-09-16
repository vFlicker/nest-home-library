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
  signup(@Body() dto: SignupDto): Promise<UserEntity> {
    return this.authService.signup(dto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<TokenPair> {
    return this.authService.login(dto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  refresh(@Body() dto: RefreshDto): Promise<TokenPair> {
    return this.authService.refresh(dto);
  }
}
