import { ErrorMessage } from '@/common/enum';
import { BaseGraphQLError } from './base-graphql-error';

export class UserNotFoundError extends BaseGraphQLError {
  constructor() {
    super(ErrorMessage.UserNotFound, 'USER_NOT_FOUND', 404);
  }
}
export class UserAlreadyExistsError extends BaseGraphQLError {
  constructor() {
    super(ErrorMessage.UserAlreadyExists, 'USER_ALREADY_EXISTS', 409);
  }
}
export class InvalidCredentialsError extends BaseGraphQLError {
  constructor() {
    super(ErrorMessage.InvalidCredentials, 'INVALID_CREDENTIALS', 400);
  }
}

export class UnauthorizedError extends BaseGraphQLError {
  constructor() {
    super(ErrorMessage.Unauthorized, 'USER_NOT_AUTHORIZED', 401);
  }
}

export class RoleNotAllowedError extends BaseGraphQLError {
  constructor() {
    super(ErrorMessage.RoleNotAllowed, 'ROLE_NOT_ALLOWED', 403);
  }
}
