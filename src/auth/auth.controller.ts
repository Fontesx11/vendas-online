import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ReturnLogin } from './dto/returnLogin.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){} 
    
    @Post()
    @UsePipes(ValidationPipe)
    async login(@Body() loginDto: LoginDto): Promise<ReturnLogin>{
        return  this.authService.login(loginDto);
    }
}
