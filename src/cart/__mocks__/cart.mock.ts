import { userEntityMock } from "../../user/__Mock__/user.mock";
import { CartEntity } from "../entities/cart.entity";

export const cartMock: CartEntity = {
  id: 64363,
  userId: userEntityMock.id,
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}