import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '@/users/entities/user.entity';
import { AuthResponse, LoginDto, RegisterDto } from './dto';
import { UserResponse } from '@/types';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async registerUser(
    @Args('registerDto') registerDto: RegisterDto,
  ): Promise<UserResponse> {
    return this.authService.register(registerDto);
  }

  @Mutation(() => AuthResponse)
  async loginUser(@Args('loginDto') loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
