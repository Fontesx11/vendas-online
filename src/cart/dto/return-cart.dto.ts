import { CartEntity } from "../entities/cart.entity";
import { ReturnCartProductDto } from "src/cart-product/dtos/return-cart-products.dto";


export class ReturnCartDto {
  
  id: number;
  cartProduct?: ReturnCartProductDto[];

  constructor(cartEntity: CartEntity){
    this.id = cartEntity.id;
    this.cartProduct = cartEntity.cartProduct ?  cartEntity.cartProduct.map((cartProduct) => new ReturnCartProductDto(cartProduct) ) : undefined;
  }
  
}