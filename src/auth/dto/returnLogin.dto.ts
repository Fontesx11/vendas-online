import { ReturnUserDto } from "src/user/dto/returnUser.dto";

export interface ReturnLogin {
    user: ReturnUserDto;
    accessToken: string;
}