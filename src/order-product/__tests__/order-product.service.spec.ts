import { Test, TestingModule } from '@nestjs/testing';
import { OrderProductService } from '../order-product.service';
import { Repository } from 'typeorm';
import { OrderProductEntity } from '../entities/oder-product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { orderProductMock } from '../__mocks__/create-order-procuct.mock';
import { productMock } from '../../product/__mocks__/product.mock';
import { orderMock } from '../../order/__mocks__/order.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { cartProductMock } from '../../cart-product/__mocks__/cart-product.mock';

describe('OrderProductService', () => {
  let service: OrderProductService;
  let orderProductRepository: Repository<OrderProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderProductService,
        {
          provide: getRepositoryToken(OrderProductEntity),
          useValue:{
            save: jest.fn().mockResolvedValue(orderProductMock)
          }
        },
      ],
    }).compile();

    service = module.get<OrderProductService>(OrderProductService);
    orderProductRepository = module.get<Repository<OrderProductEntity>>(getRepositoryToken(OrderProductEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(orderProductRepository).toBeDefined();
  });

   it('should return OrderProductEntity in save', async () => {

    const spy = jest.spyOn(orderProductRepository, 'save');
    const oderProduct = await service.createOrderProduct(productMock.id, orderMock.id, orderProductMock.price, orderProductMock.amount);

    expect(oderProduct).toEqual(orderProductMock)
    expect(spy.mock.calls[0][0].price).toEqual(orderProductMock.price);
    expect(spy.mock.calls[0][0].amount).toEqual(orderProductMock.amount);
    expect(spy.mock.calls[0][0].orderId).toEqual(orderMock.id);
    expect(spy.mock.calls[0][0].productId).toEqual(productMock.id);
    });

    it('should return erro in exception OrderProductEntity in save', async () => {

      jest.spyOn(orderProductRepository, 'save').mockRejectedValue(new Error());
    
      expect(service.createOrderProduct(
        productMock.id, orderMock.id, orderProductMock.price, orderProductMock.amount)
      ).rejects.toThrow()
   
    });
})