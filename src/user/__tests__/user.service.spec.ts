import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service'
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { get } from 'http';
import { userEntityMock } from '../__Mock__/user.mock';
import { createUserMock } from '../__Mock__/createUser.mock';
import { updatePasswordInvalid, updatePasswordMock } from '../__Mock__/update-user.mock';

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
       {
        provide: getRepositoryToken(UserEntity),
        useValue: {
          findOne: jest.fn().mockResolvedValue(userEntityMock),
          save: jest.fn().mockResolvedValue(userEntityMock),
        },
       }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  it('should return user in findByEmail', async () => {
    const user = await service.findUserByEmail(userEntityMock.email);
    expect(user).toEqual(userEntityMock)
  });

  it('should return error in findByEmail', async () => {

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    
    expect(service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrow()
  });

  it('should return error in findByEmail (error DB)', async () => {

    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    
    expect(service.findUserByEmail(userEntityMock.email),
    ).rejects.toThrow()
  });

  it('should return user in findUserById', async () => {
    const user = await service.findUserById(userEntityMock.id);
    expect(user).toEqual(userEntityMock)
  });

  it('should return error in findUserById', async () => {

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    
    expect(service.findUserById(userEntityMock.id),
    ).rejects.toThrow()
  });

  it('should return error in findUserById (error DB)', async () => {

    jest.spyOn(userRepository, 'findOne').mockRejectedValueOnce(new Error());
    
    expect(service.findUserById(userEntityMock.id),
    ).rejects.toThrow()
  });

  it('should return user in findUserIdByRelations', async () => {
    const user = await service.findUserIdByRelations(userEntityMock.id);
    expect(user).toEqual(userEntityMock)
  });

  it('should return error in findUserIdByRelations', async () => {

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    
    expect(service.findUserIdByRelations(userEntityMock.id),
    ).rejects.toThrow()
  });

  it('should return error if user exist', async () => {
    expect(service.createUser(createUserMock)).rejects.toThrow();
  });

  it('should return user if user not exist', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

    const user = await service.createUser(createUserMock);

    expect(user).toEqual(userEntityMock);
  });

   it('should return user in update password', async () => {
    const user = await service.updatePasswordUser(updatePasswordMock, userEntityMock.id);

    expect(user).toEqual(userEntityMock)
  });

  it('should return invalid password if password invalid', async () => {
    expect(
      service.updatePasswordUser(updatePasswordInvalid, userEntityMock.id)
    ).rejects.toThrow();
  });

  it('should return error IN USER NOT EXIST', async () => {

    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    expect(
      service.updatePasswordUser(updatePasswordInvalid, userEntityMock.id)
    ).rejects.toThrow();
  });
  
});
