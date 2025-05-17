import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from 'src/decorators/user-id.decorator';
import { OrderEntity } from './entities/order.entity';

@Controller('order')
export class OrderController {

  constructor(
    private readonly orderService: OrderService,
  ){}

  @Post()
  @UsePipes(ValidationPipe)
  async createOrder(@UserId() userId: number, @Body() createOrderDto: CreateOrderDto):Promise<OrderEntity>{
    return await this.orderService.createOder(createOrderDto,userId);
  }

  @Get()
  async findOrderByUserId(@UserId() userId: number){
    return this.orderService.findOrdersByUserId(userId);
  }
}
