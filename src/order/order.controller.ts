import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderService } from './order.service';
import { UserId } from '../decorators/user-id.decorator';
import { OrderEntity } from './entities/order.entity';
import { ReturnOrderDTO } from './dtos/return-order.dto';

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
  async findOrdersByUserId(@UserId() userId: number){
    return this.orderService.findOrdersByUserId(userId);
  }

  @Get('/all')
  async findAllOrders(): Promise<ReturnOrderDTO[]>{
    return (await this.orderService.findAllOrders()).map((order)=> new ReturnOrderDTO(order));
  }
}
