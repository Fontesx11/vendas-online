import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { DeleteResult, Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from '../../product/product.service';
import { returnDeleteMock } from '../../__mocks__/return-deleted.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let cartProductRepository: Repository<CartProductEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartProductService,
        {
          provide: ProductService,
          useValue:{
            findProductById: jest.fn().mockResolvedValue(productMock)
          }
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: {},
            save: {},
            delete: jest.fn().mockResolvedValue(returnDeleteMock)
          }
        }
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(getRepositoryToken(CartProductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(cartProductRepository).toBeDefined();
    expect(productService).toBeDefined();
  });

  it('should return deleted result after delete product', async () => {
    const deleteResult = await service.deleteProductInCart(productMock.id, cartMock.id)

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return error in exception deleted', async () => {
    jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error())

    expect(service.deleteProductInCart(productMock.id, cartMock.id)).rejects.toThrow();
  });
});
