import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertCartDto } from '../cart/dto/insert-cart.dto';
import { CartEntity } from '../cart/entities/cart.entity';
import { ProductService } from 'src/product/product.service';

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

}
