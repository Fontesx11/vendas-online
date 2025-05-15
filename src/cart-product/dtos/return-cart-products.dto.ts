import { ReturnCartDto } from "src/cart/dto/return-cart.dto";
import { CartProductEntity } from "../entities/cart-product.entity";
import { ReturnProductDto } from "src/product/dtos/return-product.dto";

export class ReturnCartProductDto {
  
  id: number;
  cartId: number;
  productId: number;
  amount: number;
  product?: ReturnProductDto;
  cart?: ReturnCartDto;

  constructor(cartProduct: CartProductEntity){
    this.id = cartProduct.id;
    this.cartId= cartProduct.cartId;
    this.productId= cartProduct.productId;
    this.amount= cartProduct.amount;
    this.product= cartProduct.product ? new ReturnProductDto(cartProduct.product) : undefined;
    this.cart= cartProduct.cart ? new ReturnCartDto(cartProduct.cart) : undefined;
  }
}