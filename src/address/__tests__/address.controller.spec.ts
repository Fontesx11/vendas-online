import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from '../address.controller'
import { AddressService } from '../address.service';
import { userEntityMock } from '../../user/__Mock__/user.mock';
import { createAddressMock } from '../__Mock__/create-address.mock';
import { addressMock } from '../__Mock__/address.mock';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:[
        {
          provide: AddressService,
          useValue:{
            createAddress: jest.fn().mockResolvedValue(addressMock),
            findAddressByUserId: jest.fn().mockResolvedValue([addressMock]),
          }
        },
      ],
      controllers: [AddressController],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should return addressEntity when success', async () => {
    const address = await controller.createAddress(userEntityMock.id, createAddressMock)

    expect(address).toEqual(addressMock);
  });

  it('should return addressEntity when success', async () => {
    const address = await controller.findAddressByUserId(userEntityMock.id)

    expect(address).toEqual([{
      complement: addressMock.complement,
      numberAddress: addressMock.numberAddress,
      cep: addressMock.cep,
    }]);
  });
});
