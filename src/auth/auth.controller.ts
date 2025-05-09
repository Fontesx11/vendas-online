import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { ReturnUserDto } from 'src/user/dto/returnUser.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){} 
    
    @Post()
    @UsePipes(ValidationPipe)
    async login(@Body() loginDto: LoginDto): Promise<ReturnUserDto>{
        return new ReturnUserDto(await this.authService.login(loginDto))
    }
}
