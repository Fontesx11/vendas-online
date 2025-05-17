import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from 'src/order/dtos/create-order.dto';
import { PaymentCreditCartEntity } from './entities/payment-credit-cart.entity';
import { paymentType } from 'src/payment-status/enums/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';

@Injectable()
export class PaymentService {

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>
  ) {}

  async createPayment(createOrderDto: CreateOrderDto): Promise<PaymentEntity>{

    if(createOrderDto.amountPayments){
      const paymentCreditCard =  new PaymentCreditCartEntity(
        paymentType.Done,
        0,
        0,
        0,
        createOrderDto,
      );

      return this.paymentRepository.save(paymentCreditCard)

    } else if(createOrderDto.codePix && createOrderDto.datePayment){
       const paymentPix =  new PaymentPixEntity(
        paymentType.Done,
        0,
        0,
        0,
        createOrderDto,
      );

      return this.paymentRepository.save(paymentPix)
    }

    throw new BadRequestException('Amount Payments or code pix or date payment not found')
  }
}
