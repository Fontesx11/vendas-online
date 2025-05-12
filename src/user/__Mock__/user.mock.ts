import { UserEntity } from "../entities/user.entity";
import { TypeUser } from "../enum/user-type.enum";

export const userEntityMock: UserEntity = {
  cpf: "12345678901",
  email: "wyugdw@gamil.com",
  id: 243,
  name: "John Doe",
  password: "$2b$10$VcOKwSD10wQByl4zl3q97uRVozw3xyEL4zbVxuPdtUZnCUnjK0qlu",
  phone: "1234567890",
  typeUser: TypeUser.User,
  updatedAt: new Date(),
  createdAt: new Date(),
}