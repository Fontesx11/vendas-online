import { Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginPayload } from './dto/loginPayload.dto';
import { ReturnLogin } from './dto/returnLogin.dto';
import { ReturnUserDto } from '../user/dto/returnUser.dto';
import { validatePassword } from '../utils/password';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService    
    ) {}

    async login(loginDto: LoginDto): Promise<ReturnLogin>{ 
        const user: UserEntity | undefined = await this.userService.findUserByEmail(loginDto.email).catch(()=> undefined);
      
        const isMatch = await validatePassword(loginDto.password, user?.password || '');

        if(!isMatch || !user) throw new NotFoundException(`Email or Password Invalid`);

        return {
            accessToken: this.jwtService.sign({ ...new LoginPayload(user) }),
            user: new ReturnUserDto(user),
        }
    }
}
