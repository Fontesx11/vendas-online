import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { InsertCartDto } from './dto/insert-cart.dto';
import { CartEntity } from './entities/cart.entity';
import { CartService } from './cart.service';
import { UserId } from '..//decorators/user-id.decorator';
import { Roles } from '..//decorators/roles.decorator';
import { TypeUser } from '..//user/enum/user-type.enum';
import { ReturnCartDto } from './dto/return-cart.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCartDto } from './dto/update-cart.dto';

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

  

  @Roles(TypeUser.User)
  @Get()
  async findCartByUserId(@UserId() userId: number): Promise<ReturnCartDto>{
    return new ReturnCartDto(await this.cartService.findCartByUserId(userId,true));
  }

  @Roles(TypeUser.User)
  @Delete()
  async clearCart(@UserId() userId: number): Promise<DeleteResult>{
   
    return await this.cartService.clearCart(userId)
  }

  @Roles(TypeUser.User)
  @Delete('/product/:productId')
  async deleteProductInCart(@UserId() userId: number, @Param('productId') productId: number): Promise<DeleteResult>{
   
    return await this.cartService.deleteProductInCart(productId, userId)
  }

  @Roles(TypeUser.User)
  @UsePipes(ValidationPipe)
  @Patch()
  async updateProductAmountInCart (@Body() updateCartDto: UpdateCartDto, @UserId() userId: number): Promise<ReturnCartDto>{
   
    return new ReturnCartDto(await this.cartService.updateProductAmountInCart(updateCartDto, userId)); 
  }
}
