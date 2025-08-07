import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto';

import { UseGuards } from '@nestjs/common';
import { GqlJWTAuthGuard } from '@/auth/guard';
import { JWTUser } from '@/common/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlJWTAuthGuard)
  @Query(() => User, { name: 'getMe' })
  findMe(@JWTUser() user: User) {
    return user;
  }

  @UseGuards(GqlJWTAuthGuard)
  @Mutation(() => User)
  updateUser(
    @JWTUser('id') id: number,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUserInput);
  }

  @UseGuards(GqlJWTAuthGuard)
  @Mutation(() => Boolean)
  async removeUser(@JWTUser('id') id: number): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
