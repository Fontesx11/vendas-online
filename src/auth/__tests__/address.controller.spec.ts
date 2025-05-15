import { Test, TestingModule } from '@nestjs/testing';

import { userEntityMock } from '../../user/__Mock__/user.mock';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { authLoginMock } from '../__Mock__/auth-login.mock';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:[
        {
          provide: AuthService,
          useValue:{
            login: jest.fn().mockResolvedValue(authLoginMock)
          }
        },
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should return authLoginMock', async () => {
    const user  = await controller.login(userEntityMock)

    expect(user).toEqual(authLoginMock)
  });

  
});
