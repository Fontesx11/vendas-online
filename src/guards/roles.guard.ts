
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoginPayload } from '../auth/dto/loginPayload.dto';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { TypeUser } from '../user/enum/user-type.enum';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<TypeUser[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { authorization } = context.switchToHttp().getRequest().headers;

    const loginPayload: LoginPayload | undefined = await this.jwtService.verifyAsync(authorization, {
    secret: process.env.JWT_SECRET}).catch(()=> undefined);

    if(!loginPayload){
      return false;
    }
    
    return requiredRoles.some((role) => role === loginPayload.typeUser);
  }
}
