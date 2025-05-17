import { Body, Controller, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from 'src/decorators/user-id.decorator';

@Controller('order')
export class OrderController {

  constructor(
    private readonly orderService: OrderService,
  ){}

  @Post('/cart/:cartId')
  @UsePipes(ValidationPipe)
  async createOrder(@Param('cartId') cartId: number, @UserId() userId: number, @Body() createOrderDto: CreateOrderDto){
     await this.orderService.createOder(createOrderDto,cartId,userId);
  }
}
