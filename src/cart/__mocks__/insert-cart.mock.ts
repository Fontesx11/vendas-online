import { productMock } from "../../product/__mocks__/product.mock";
import { InsertCartDto } from "../dto/insert-cart.dto";

export const InsertCartMock: InsertCartDto = {

  productId: productMock.id,
  amount: 5,
}