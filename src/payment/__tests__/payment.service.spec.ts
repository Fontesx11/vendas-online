import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productMock } from '../../product/__mocks__/product.mock';
import { cartMock } from '../../cart/__mocks__/cart.mock';
import { createOrderCreditCardMock, createOrderPixMock } from '../../order/__mocks__/create-order.mock';
import { paymentMock } from '../__mocks__/payment.mock';
import { paymentPixMock } from '../__mocks__/payment-pix.mock';
import { PaymentPixEntity } from '../entities/payment-pix.entity';
import { PaymentCreditCartEntity } from '../entities/payment-credit-cart.entity';
import { paymentCreditCardMock } from '../__mocks__/payment-credit-card.mock';
import { BadRequestException } from '@nestjs/common';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue:{
            save: jest.fn().mockResolvedValue(paymentMock),
          }
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<PaymentEntity>>(getRepositoryToken(PaymentEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  it('should return pix payment in save', async () => {
    const spy = jest.spyOn(paymentRepository,  'save');
    const payment = await service.createPayment(createOrderPixMock,[productMock],cartMock)

    const savePayment: PaymentPixEntity = spy.mock.calls[0][0] as PaymentPixEntity;

    expect(payment).toEqual(paymentMock);
    expect(savePayment.code).toEqual(paymentPixMock.code);
    expect(savePayment.datePayment).toEqual(paymentPixMock.datePayment);
  });

  it('should return credit card payment in save', async () => {
    const spy = jest.spyOn(paymentRepository,  'save');
    const payment = await service.createPayment(createOrderCreditCardMock,[productMock],cartMock)

    const savePayment: PaymentCreditCartEntity = spy.mock.calls[0][0] as PaymentCreditCartEntity;

    expect(payment).toEqual(paymentMock);
    expect(savePayment.amountPayments).toEqual(paymentCreditCardMock.amountPayments);
  });

  it('should return credit card payment in save', async () => {
    const spy = jest.spyOn(paymentRepository,  'save');
    const payment = await service.createPayment(createOrderCreditCardMock,[productMock],cartMock)

    const savePayment: PaymentCreditCartEntity = spy.mock.calls[0][0] as PaymentCreditCartEntity;

    expect(payment).toEqual(paymentMock);
    expect(savePayment.amountPayments).toEqual(paymentCreditCardMock.amountPayments);
  });

  it('should return error if send imcomplete data', async () => {
      expect(service.createPayment(
        {addressId: 1},
        [productMock],
        cartMock
      ),
    ).rejects.toThrow(BadRequestException)
  });

});
