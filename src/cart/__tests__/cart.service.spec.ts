import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { Repository } from 'typeorm';
import { CartEntity } from '../entities/cart.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartProductService } from '../../cart-product/cart-product.service';
import { productMock } from '../../product/__mocks__/product.mock';
import { userEntityMock } from '../../user/__Mock__/user.mock';
import { cartMock } from '../__mocks__/cart.mock';
import { returnDeleteMock } from '../../__mocks__/return-deleted.mock';

describe('CartService', () => {
  let service: CartService;
  let cartRepository: Repository<CartEntity>;
  let cartProductService: CartProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartProductService,
          useValue:{
            insertProductInCart:{},
            updateProductAmountInCart:{},
            deleteProductInCart: jest.fn().mockResolvedValue(returnDeleteMock)
          }
        },
        {
          provide: getRepositoryToken(CartEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(cartMock),
            findOne: jest.fn().mockResolvedValue(cartMock),
          }
        }
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    cartProductService = module.get<CartProductService>(CartProductService);
    cartRepository = module.get<Repository<CartEntity>>(getRepositoryToken(CartEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartRepository).toBeDefined();
     expect(cartProductService).toBeDefined();
  });

  //  it('should be defined', async () => {
  //   const cart = await service.deleteProductInCart(productMock.id, userEntityMock.id);

  //   expect(cart).toBeDefined();
  // });clearCart

  
  it('should return delete result if delete cart', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const resultDelete = await service.clearCart(userEntityMock.id)

    expect(resultDelete).toEqual(returnDeleteMock)
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartMock,
      active: false,
    })
  });
});
