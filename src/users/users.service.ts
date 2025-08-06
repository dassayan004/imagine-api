import { Injectable } from '@nestjs/common';
import { CreateUserInput, UpdateUserInput } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { omit } from 'lodash';
import { UserResponse } from '@/types';
import { UserNotFoundError } from '@/filters/errors';

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
    const user = await this.findOne(id);
    Object.assign(user, input);
    return this.userRepo.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return true;
  }
}
