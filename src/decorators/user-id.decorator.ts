import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { authorizationToLogin } from "../utils/base-64-converter";

export const UserId = createParamDecorator(
    (_, ctx: ExecutionContext) => {
        const { authorization } = ctx.switchToHttp().getRequest().headers;

        const LoginPayload = authorizationToLogin(authorization);

        return LoginPayload?.id;
    }
     
  );