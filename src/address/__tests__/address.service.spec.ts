import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address.service';
import { AddressEntity } from '../entities/address.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { addressMock } from '../__Mock__/address.mock';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__Mock__/user.mock';
import { CityService } from '../../city/city.service';
import { cityMock } from '../../city/__mocks__/city.mock';
import { create } from 'domain';
import { createAddressMock } from '../__Mock__/create-address.mock';

describe('AddressService', () => {
  let service: AddressService;
  let userService: UserService;
  let cityService: CityService;
  let addressRepository: Repository<AddressEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService,
       {
          provide: UserService,
          useValue: {
            findUserById: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: CityService,
          useValue: {
            findCityById: jest.fn().mockResolvedValue(cityMock),
          },
        },
        {
          provide: getRepositoryToken(AddressEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(addressMock),
            find: jest.fn().mockResolvedValue(addressMock),
          },
        }
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    userService = module.get<UserService>(UserService);
    cityService = module.get<CityService>(CityService);

    addressRepository = module.get<Repository<AddressEntity>>(
      getRepositoryToken(AddressEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
    expect(cityService).toBeDefined();
    expect(addressRepository).toBeDefined();
  });

  it('should return address after save', async () => {
    const address = await service.createAddress(createAddressMock, userEntityMock.id);
    expect(address).toEqual(addressMock);
  });

   it('should return error exception in UserService', async () => {
    jest.spyOn(userService, 'findUserById').mockRejectedValue(new Error());
    expect(
      service.createAddress(createAddressMock, userEntityMock.id),
    ).rejects.toThrow();
  });

  it('should return error exception in CityService', async () => {
    jest.spyOn(cityService, 'findCityById').mockRejectedValue(new Error());
    expect(
      service.createAddress(createAddressMock, userEntityMock.id),
    ).rejects.toThrow();
  });

  it('should return addresses to user', async () => {
    const addresses = await service.findAddressByUserId(userEntityMock.id);

    expect(addresses).toEqual(addressMock);
  });

   it('should return not found if not address registred', async () => {
    jest.spyOn(addressRepository, 'find').mockResolvedValue([]);

    expect(
      service.findAddressByUserId(userEntityMock.id),
    ).rejects.toThrow()
  });
  
});
