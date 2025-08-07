// src/auth/decorators/current-user.decorator.ts
import { User } from '@/users/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const JWTUser = createParamDecorator(
  (
    data: keyof User | undefined,
    context: ExecutionContext,
  ): User | User[keyof User] => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<{ req: Request }>().req;
    const user = request.user as User;

    return data ? user[data] : user;
  },
);
