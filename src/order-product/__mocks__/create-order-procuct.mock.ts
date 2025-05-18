import { orderMock } from "../../order/__mocks__/order.mock";
import { OrderProductEntity } from "../entities/oder-product.entity";
import { productMock } from "../../product/__mocks__/product.mock";


export const orderProductMock: OrderProductEntity =  {
  id: 12,
  orderId: orderMock.id,
  productId: productMock.id,
  amount: 12,
  price: 69,
  createdAt: new Date(),
  updatedAt: new Date(),

}