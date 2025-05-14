import { UpdatePasswordDto } from "../dto/update-password.dto";
import { UserEntity } from "../entities/user.entity";
import { TypeUser } from "../enum/user-type.enum";

export const updatePasswordMock: UpdatePasswordDto = {
  lastPassword: "abc",
  newPassword: "$2b$10$",
}

export const updatePasswordInvalid: UpdatePasswordDto = {
  lastPassword: 'wqed9qwgbud',
  newPassword: "$2b$10$wdw",
}