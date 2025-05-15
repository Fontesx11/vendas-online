import { cartMock } from '../../cart/__mocks__/cart.mock';
import { CartProductEntity } from '../entities/cart-product.entity';
import { productMock } from '../../product/__mocks__/product.mock';

export const cartProductMock: CartProductEntity = {
  id: 1,
  cartId: cartMock.id,
  productId: productMock.id,
  amount: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
};
