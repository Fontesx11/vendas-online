import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { ReturnUserDto } from './dto/returnUser.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserId } from '../decorators/user-id.decorator';
import { Roles } from '../decorators/roles.decorator';
import { TypeUser } from './enum/user-type.enum';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @UsePipes(ValidationPipe)
  @Post()
  async createUser(@Body() createUser: CreateUserDto): Promise<UserEntity>{

    return this.userService.createUser(createUser);
  }

  @Roles(TypeUser.Root)
  @Post('/admin')
  async createAdmin(@Body() createUser: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(createUser, TypeUser.Admin);
  }

  @Roles(TypeUser.Admin)
  @Get('/all')
  async getAllUsers(): Promise<ReturnUserDto[]>{
    return (await this.userService.getAllUsers()).map((userEntity) => new ReturnUserDto(userEntity));
  }

  @Roles(TypeUser.Admin)
  @Get(':userId')
  async getUserById(@Param('userId') userId: number): Promise<ReturnUserDto>{
    return new ReturnUserDto(await this.userService.findUserIdByRelations(userId));
  }

  @Roles(TypeUser.Admin, TypeUser.User)
  @Patch()
  @UsePipes(ValidationPipe)
  async updatePasswordUser(@UserId('userId') userId: number, @Body() updatePasswordDto: UpdatePasswordDto):Promise<UserEntity>{
    return await this.userService.updatePasswordUser(updatePasswordDto, userId)
  }

  @Roles(TypeUser.Admin, TypeUser.User)
  @Get()
  async getUserInfoByToken(@UserId() userId: number): Promise<ReturnUserDto>{
    return new ReturnUserDto( await this.userService.findUserIdByRelations(userId))
  }
}
