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
import { NotFoundException } from '@nestjs/common';
import { InsertCartMock } from '../__mocks__/insert-cart.mock';
import { updateCartMock } from '../__mocks__/update-cart.mock';

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
            insertProductInCart:jest.fn().mockResolvedValue(undefined),
            updateProductAmountInCart:jest.fn().mockResolvedValue(undefined),
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

   it('should return DeleteResult in deleteProductCart', async () => {
    const spy = jest.spyOn(cartProductService, 'deleteProductInCart');
    const deleteResult = await service.deleteProductInCart(
      productMock.id,
      userEntityMock.id,
    );

    expect(deleteResult).toEqual(returnDeleteMock);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return NotFoundException in cart not exist', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);
    const spy = jest.spyOn(cartProductService, 'deleteProductInCart');

    expect(
      service.deleteProductInCart(productMock.id, userEntityMock.id),
    ).rejects.toThrow(NotFoundException);
    expect(spy.mock.calls.length).toEqual(0);
  });

  it('should return DeleteResult in deleteProductCart', async () => {
    const spy = jest.spyOn(cartProductService, 'deleteProductInCart');
    const deleteResult = await service.deleteProductInCart(
      productMock.id,
      userEntityMock.id,
    );

    expect(deleteResult).toEqual(returnDeleteMock);
    expect(spy.mock.calls.length).toEqual(1);
  });

  it('should return NotFoundException in cart not exist', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);
    const spy = jest.spyOn(cartProductService, 'deleteProductInCart');

    expect(
      service.deleteProductInCart(productMock.id, userEntityMock.id),
    ).rejects.toThrow(NotFoundException);
    expect(spy.mock.calls.length).toEqual(0);
  });

  it('should return cart in updateProductInCart', async () => {
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'updateProductAmountInCart',
    );
    const spySave = jest.spyOn(cartRepository, 'save');
    const cart = await service.updateProductAmountInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
    expect(spySave.mock.calls.length).toEqual(0);
  });

  it('should return cart in createCart', async () => {
    jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);

    const spySave = jest.spyOn(cartRepository, 'save');
    const cart = await service.updateProductAmountInCart(
      updateCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spySave.mock.calls.length).toEqual(1);
  });

  
  it('should return delete result if delete cart', async () => {
    const spy = jest.spyOn(cartRepository, 'save');

    const resultDelete = await service.clearCart(userEntityMock.id)

    expect(resultDelete).toEqual(returnDeleteMock)
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartMock,
      active: false,
    })
  });

  it('should return error in findOne undefined', async () => {
   jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);

    expect(service.clearCart(userEntityMock.id)).rejects.toThrow(NotFoundException)
  });

   it('should return cart in success {not send relations}', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id);
    
    expect(cart).toEqual(cartMock)
    expect(spy.mock.calls[0][0].relations).toEqual(undefined)

  });

  it('should return cart in success {send relations}', async () => {
    const spy = jest.spyOn(cartRepository, 'findOne');
    const cart = await service.findCartByUserId(userEntityMock.id, true);
    
    expect(cart).toEqual(cartMock)
    expect(spy.mock.calls[0][0].relations).toEqual(
      {
        cartProduct:{
          product: true,
        } 
      }
    )
  });

  it('should return notFoundException in notfound cart ', async () => {
   jest.spyOn(cartRepository, 'findOne').mockResolvedValue(null);
    
    expect(service.findCartByUserId(userEntityMock.id, true)).rejects.toThrow(NotFoundException)
  });

  it('should send info when save', async () => {
    const spy = jest.spyOn(cartRepository, 'save')

    const cart = await service.createCart(userEntityMock.id)

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls[0][0]).toEqual({
      active: true,
      userId: userEntityMock.id,
    })
  });


  it('should return cart in cart not found (insertProductInCart)', async () => {
    jest.spyOn(cartRepository, 'findOne').mockRejectedValue(undefined);
    const spy = jest.spyOn(cartRepository, 'save');
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const cart = await service.insertProductInCart(
      InsertCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls.length).toEqual(1);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
  });

  
  it('should return cart in cart not found (insertProductInCart)', async () => {
    const spy = jest.spyOn(cartRepository, 'save');
    const spyCartProductService = jest.spyOn(
      cartProductService,
      'insertProductInCart',
    );

    const cart = await service.insertProductInCart(
      InsertCartMock,
      userEntityMock.id,
    );

    expect(cart).toEqual(cartMock);
    expect(spy.mock.calls.length).toEqual(0);
    expect(spyCartProductService.mock.calls.length).toEqual(1);
  });

  
});
