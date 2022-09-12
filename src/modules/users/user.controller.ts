import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { uuidV4Decorator } from '../../common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entities';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): UserEntity {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(): UserEntity[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', uuidV4Decorator) id: string): UserEntity {
    return this.userService.findOne(id);
  }

  @Put(':id')
  updatePassword(
    @Param('id', uuidV4Decorator) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserEntity {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', uuidV4Decorator) id: string): void {
    return this.userService.remove(id);
  }
}
