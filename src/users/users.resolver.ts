import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto';

import { UseGuards } from '@nestjs/common';
import { GqlJWTAuthGuard } from '@/auth/guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlJWTAuthGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(GqlJWTAuthGuard)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @UseGuards(GqlJWTAuthGuard)
  @Mutation(() => Boolean)
  async removeUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
