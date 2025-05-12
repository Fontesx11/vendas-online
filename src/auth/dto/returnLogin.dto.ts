import { ReturnUserDto } from "../../user/dto/returnUser.dto";

export interface ReturnLogin {
    user: ReturnUserDto;
    accessToken: string;
}