import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const transcationEntityManager = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      return request.manager;
    },
  );