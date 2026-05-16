import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurrentUserPayload = { id: string; email: string };

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
