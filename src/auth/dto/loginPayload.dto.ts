import { UserEntity } from "../../user/entities/user.entity";

export class LoginPayload {
    id: number;
    typeUser: number;

    constructor(userEntity: UserEntity) {
        this.id = userEntity.id;
        this.typeUser = userEntity.typeUser;
    }
}
