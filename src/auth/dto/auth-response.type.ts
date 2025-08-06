// auth-response.type.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@/users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;
}
