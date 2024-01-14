import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetDecodedJwtPayload = createParamDecorator(
    (data: string | undefined,context:ExecutionContext)=>{
     const req = context.switchToHttp().getRequest();
     if(!data) return req?.user;
     return req?.user[data];
});