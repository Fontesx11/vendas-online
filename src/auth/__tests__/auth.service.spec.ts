import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__Mock__/user.mock';
import { JwtService } from '@nestjs/jwt';
import { authMock } from '../__Mock__/auth.mock';
import { loginUserMock } from '../__Mock__/login-user.mock';
import { access } from 'fs';
import { ReturnUserDto } from '../../user/dto/returnUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
       {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: ()=> authMock,
          },
        },
      
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    
  });

  it('should be return user if login', async () => {
    const user = await service.login(loginUserMock);

    expect(user).toEqual({
      accessToken: authMock,
      user: new ReturnUserDto(userEntityMock),
    });
    
  });

  it('should be return error if password invalid and email valid', async () => {
    expect(
      service.login({...loginUserMock, password: 'invalid'}))
      .rejects.toThrow();
  });

  it('should be return error if email not exist', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockRejectedValue(new Error());

    expect(service.login(loginUserMock)).rejects.toThrow();
  });


});
