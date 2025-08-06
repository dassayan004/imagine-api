import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { omit } from 'lodash';
import { UserResponse } from '@/types';
import {
  BaseGraphQLError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from '@/filters/errors';
import { PostgresErrorCode } from '@/enum';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserInput): Promise<UserResponse> {
    const user = this.userRepo.create(createUserDto);
    await this.userRepo.save(user);

    return omit(user, ['password']);
  }
  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new UserNotFoundError();

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new UserNotFoundError();
    return user;
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    try {
      const user = await this.findOne(id);
      Object.assign(user, input);
      return await this.userRepo.save(user);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new UserAlreadyExistsError();
      }

      throw new BaseGraphQLError(
        error,
        'INTERNAL_SERVER_ERROR',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return true;
  }
}
