import { Module } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [UserService],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
