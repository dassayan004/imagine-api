// src/auth/guards/jwt-auth.guard.ts

import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UnauthorizedError } from '@/filters/errors';

@Injectable()
export class GqlJWTAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedError();
    }
    return user;
  }
}
