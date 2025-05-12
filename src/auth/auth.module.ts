import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [UserModule,
     ConfigModule.forRoot({
          envFilePath: '.env.development.local',
        }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
