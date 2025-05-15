import { Test, TestingModule } from '@nestjs/testing';
import { CartProductService } from '../cart-product.service';
import { DeleteResult, Repository } from 'typeorm';
import { CartProductEntity } from '../entities/cart-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from '../../product/product.service';
import { returnDeleteMock } from '../../__mocks__/return-deleted.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { InsertCartMock } from '../../cart/__mocks__/insert-cart.mock';
import { cartProductMock } from '../__mocks__/cart-product.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartMock } from '../../cart/__mocks__/update-cart.mock';

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
            findOne: jest.fn().mockResolvedValue(cartProductMock),
            save: jest.fn().mockResolvedValue(cartProductMock),
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

  it('should return cartProduct after create', async () => {
    const cartProduct = await service.createProductInCart(InsertCartMock, cartMock.id)

    expect(cartProduct).toEqual(cartProductMock);
  });

  it('should return error cartProduct after save', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error())

    expect(service.createProductInCart(InsertCartMock, cartMock.id)).rejects.toThrow();
  });

  it('should return cartProduct if exist', async () => {
    const product = await service.verifyProductInCart(InsertCartMock.productId, cartMock.id)

    expect(product).toEqual(cartProductMock);
  });

  it('should return error if product not exist in cart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(null)

    expect(service.verifyProductInCart(InsertCartMock.productId, cartMock.id)).rejects.toThrow(NotFoundException);
  });

  it('should return error if product not exist in cart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(service.verifyProductInCart(InsertCartMock.productId, cartMock.id)).rejects.toThrow();
  });


  it('should return error in exception if product not exist in insertProductCart', async () => {
    jest.spyOn(productService, 'findProductById').mockRejectedValue(new NotFoundException());

    expect(service.insertProductInCart(InsertCartMock, cartMock)).rejects.toThrow(NotFoundException);
  });

  it('should return cart product if not exist cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(null);

    const cartProduct = await service.insertProductInCart(
      InsertCartMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(InsertCartMock.amount);
  });

  it('should return cart product if not exist cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(
      InsertCartMock,
      cartMock,
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProductMock,
      amount: cartProductMock.amount + InsertCartMock.amount,
    });
  });

  it('should return error in exception updateProductAmountInCart', async () => {
    jest
      .spyOn(productService, 'findProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.updateProductAmountInCart(cartMock, updateCartMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return cart product if not exist cart (updateProductAmountInCart)', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(null);

    expect(
      service.updateProductAmountInCart(cartMock, updateCartMock),
    ).rejects.toThrow(NotFoundException);
  });

  it('should return cart product if not exist cart (updateProductAmountInCart)', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.updateProductAmountInCart(
      cartMock, 
      updateCartMock
    );

    expect(cartProduct).toEqual(cartProductMock);
    expect(spy.mock.calls[0][0].amount).toEqual(updateCartMock.amount);
  });

});
