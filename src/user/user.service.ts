import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './entities/user.entity';
import { hash } from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { TypeUser } from './enum/user-type.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { creatPasswordHashed, validatePassword } from '../utils/password';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser( createUserDto: CreateUserDto ): Promise<UserEntity> {
    
    const user = await this.findUserByEmail(createUserDto.email).catch(()=> undefined)
    
    if(user){
      throw new BadGatewayException('Email already registered')
    }

    const passwordHashed = await creatPasswordHashed(createUserDto.password,);

    return this.userRepository.save({
      ...createUserDto,
      typeUser: TypeUser.User,
      password: passwordHashed,
    })
  }

  async creatPasswordHashed(password: string): Promise<string>{
    const saltOrRounds = 10;
    return await hash(password, saltOrRounds);
  }

  async getAllUsers(): Promise<UserEntity[]>{
    return this.userRepository.find();
  }
  
  async findUserById(userId: number): Promise<UserEntity>{
    const user = await this.userRepository.findOne({
      where:{
        id: userId,
      }
    });

    if(!user) throw new NotFoundException(`UserId Not Found`);

    return user
  }

  async findUserIdByRelations(userId: number): Promise<UserEntity>{
    const user = await this.userRepository.findOne({
      where:{
        id: userId,
      },
      relations:{
        addresses:{
          city:{
            state: true,
          }
        }
      },
    });

    if(!user) throw new NotFoundException(`UserId Not Found`);

    return user
  }

  async findUserByEmail(email: string): Promise<UserEntity>{
    const user = await this.userRepository.findOne({
      where:{
        email: email,
      }
    });

    if(!user) throw new NotFoundException(`Email ${email} Not Found`);

    return user
  }

  async updatePasswordUser(UpdatePasswordDto: UpdatePasswordDto, userId: number): Promise<UserEntity>{
    const user = await this.findUserById(userId);
    
    const passwordHashed = await creatPasswordHashed(UpdatePasswordDto.newPassword);

    const isMatch = await validatePassword(UpdatePasswordDto.lastPassword, user.password || '');

    if(!isMatch){
      throw new BadRequestException("Last apssword invalid")
    }

    return await this.userRepository.save({
    ...user,
    password: passwordHashed,
    })

  }
}
