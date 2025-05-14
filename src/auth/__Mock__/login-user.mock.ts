import { userEntityMock } from "../../user/__Mock__/user.mock";
import { LoginDto } from "../dto/login.dto";

export const loginUserMock: LoginDto = {
    email: userEntityMock.email,
    password: "abc",
}