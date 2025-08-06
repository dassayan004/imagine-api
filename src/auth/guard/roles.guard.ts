// role.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@/enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '@/decorators/roles.decorator';
import { RoleNotAllowedError } from '@/filters/errors';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: Role[], userRoles: Role[]) {
    return roles.some((role) => userRoles.includes(role));
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user }: { user: User } = ctx.getContext().req;

    const hasRole = this.matchRoles(requiredRoles, [user.roles]);
    if (!hasRole) {
      throw new RoleNotAllowedError();
    }

    return true;
  }
}
