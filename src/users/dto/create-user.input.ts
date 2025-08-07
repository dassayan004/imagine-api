import { InputType, Field } from '@nestjs/graphql';
import { Role } from '@/common/enum';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field(() => Role, { nullable: true })
  @IsEnum(Role)
  roles: Role;
}
