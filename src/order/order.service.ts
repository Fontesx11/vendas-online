import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { PaymentService } from 'src/payment/payment.service';
import { CartService } from 'src/cart/cart.service';
import { OrderProductService } from 'src/order-product/order-product.service';

@Injectable()
export class OrderService {


   constructor(
    @InjectRepository(OrderEntity)
    private readonly onderRepository: Repository<OrderEntity>,
    private readonly paymentService: PaymentService,
    private readonly cartService: CartService,
    private readonly orderProductService: OrderProductService,
  ){}

  async createOder(createOrderDto: CreateOrderDto, cartId: number, userId: number){
    const payment = await this.paymentService.createPayment(createOrderDto);

    const order = await this.onderRepository.save({
      addressId: createOrderDto.addressId,
      date: new Date(),
      paymentId: payment.id,
      userId,
    })

    const cart = await this.cartService.findCartByUserId(userId, true);

    cart.cartProduct?.forEach((cartProduct)=>{
      this.orderProductService.createOrderProduct(
        cartProduct.productId,
        order.id,
        0,
        cartProduct.amount,
      )
    })

    return null
  }
}
