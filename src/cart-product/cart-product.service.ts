import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertCartDto } from '../cart/dto/insert-cart.dto';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductService } from 'src/product/product.service';
import { UpdateCartDto } from 'src/cart/dto/update-cart.dto';

@Injectable()
export class CartProductService {

  constructor(
    @InjectRepository(CartProductEntity)
    private readonly cartProductRepository: Repository<CartProductEntity>,
    private readonly productService: ProductService
  ) {}

  async verifyProductInCart(productId: number, cartId: number): Promise<CartProductEntity>{
    const cartProduct = await this.cartProductRepository.findOne({
      where:{
        productId,
        cartId,
      }
    });

    if(!cartProduct){
      throw new NotFoundException("Product Not Found in cart");
    }

    return cartProduct;
  }

  async createCartProdudctInCart(insertCartDto: InsertCartDto, cartId: number): Promise<CartProductEntity>{
    return this.cartProductRepository.save({
      amount: insertCartDto.amount,
      productId: insertCartDto.productId,
      cartId,

    });
  }

  async insertProductInCart(insertCart: InsertCartDto, cart: CartEntity){
    await this.productService.findProductById(insertCart.productId);

    const cartProduct =  await this.verifyProductInCart(insertCart.productId, cart.id).catch(()=> undefined);
    
    if(!cartProduct){
      return this.createCartProdudctInCart(insertCart, cart.id);
    };
    
    return this.cartProductRepository.save({
      ...cartProduct,
      amount: cartProduct.amount + insertCart.amount,
    });
  }

  async updateProductAmountInCart(cart: CartEntity, updateCartDto:UpdateCartDto){
    await this.productService.findProductById(updateCartDto.productId);

    const cartProduct =  await this.verifyProductInCart(updateCartDto.productId, cart.id);
    
    if(!cartProduct){
       throw new NotFoundException("Product not found in cart");
    };
    
    return this.cartProductRepository.save({
      ...cartProduct,
      amount: updateCartDto.amount,
    });
  }

  async deleteProductInCart(productId: number, cartId: number): Promise<DeleteResult>{
    return await this.cartProductRepository.delete({productId, cartId})
  }

}
