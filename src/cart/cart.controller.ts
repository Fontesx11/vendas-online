import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { InsertCartDto } from './dto/insert-cart.dto';
import { CartEntity } from './entities/cart.entity';
import { CartService } from './cart.service';
import { UserId } from '..//decorators/user-id.decorator';
import { Roles } from '..//decorators/roles.decorator';
import { TypeUser } from '..//user/enum/user-type.enum';
import { ReturnCartDto } from './dto/return-cart.dto';

@Controller('cart')
export class CartController {

  constructor(
    private readonly cartService: CartService,
  ) {}
  @Roles(TypeUser.User, TypeUser.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createCart(@Body() insertCart: InsertCartDto, @UserId() userId: number): Promise<ReturnCartDto>{
    
    
    return new ReturnCartDto(await this.cartService.insertProductInCart(insertCart, userId))
  }
}
