// role.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from '@/common/enum';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { RoleNotAllowedError } from '@/common/filters/errors';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(requiredRoles: Role[], userRole: Role): boolean {
    return requiredRoles.includes(userRole);
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const ctx = GqlExecutionContext.create(context);
    const { user }: { user: User } = ctx.getContext().req;
    console.log('user roles:', user.roles, 'required roles:', requiredRoles);

    const hasRole = this.matchRoles(requiredRoles, user.roles);
    if (!hasRole) {
      throw new RoleNotAllowedError();
    }

    return true;
  }
}
