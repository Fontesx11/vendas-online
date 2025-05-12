import { cityMock } from "../../city/__mocks__/city.mock";
import { AddressEntity } from "../entities/address.entity";
import { userEntityMock } from "../../user/__Mock__/user.mock";


export const addressMock: AddressEntity = {
  cep: '12345678',
  cityId: cityMock.id,
  complement: 'Apt 101',
  createdAt: new Date(),
  id: 124,
  numberAddress: 123234,
  updatedAt: new Date(),
  userId: userEntityMock.id,
}