import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dto/returnUser.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from '../decorators/user-id.decorator';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<UserEntity>{

    return this.userService.createUser(createUser);
  }

  @Get()
  async getAllUsers(): Promise<ReturnUserDto[]>{
    return (await this.userService.getAllUsers()).map((userEntity) => new ReturnUserDto(userEntity));
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto>{
    return new ReturnUserDto(await this.userService.findUserIdByRelations(userId));
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async updatePasswordUser(@UserId('userId') userId: number, @Body() updatePasswordDto: UpdatePasswordDto):Promise<UserEntity>{
    return await this.userService.updatePasswordUser(updatePasswordDto, userId)
  }
}
