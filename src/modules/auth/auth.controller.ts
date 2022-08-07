import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto, RefreshDto, SignupDto } from './dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
