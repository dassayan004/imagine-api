// role.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ErrorMessage, Role } from '@/enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '@/decorators/roles.decorator';

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
    const { user } = ctx.getContext().req;
    if (!user || !user.roles) {
      throw new ForbiddenException(ErrorMessage.Unauthorized);
    }

    const hasRole = this.matchRoles(requiredRoles, user.roles);
    if (!hasRole) {
      throw new ForbiddenException(ErrorMessage.RoleNotAllowed);
    }

    return true;
  }
}
