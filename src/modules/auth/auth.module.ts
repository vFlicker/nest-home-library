import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserService, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
