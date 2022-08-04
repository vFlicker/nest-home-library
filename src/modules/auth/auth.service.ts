import { Injectable } from '@nestjs/common';

import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(signupDto: SignupDto): Promise<UserEntity> {
    const user = await this.userService.create(signupDto);
    return user;
  }
}
