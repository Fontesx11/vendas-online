import { CartEntity } from "../entities/cart.entity";

export const cartMock: CartEntity = {
  id: 1,
  userId: 123,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}