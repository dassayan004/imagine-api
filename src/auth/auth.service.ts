import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.input';
import bcrypt from 'bcryptjs';
import { ErrorMessage, PostgresErrorCode, Role } from '@/enum';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from '@/users/dto';
import { AuthResponse, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  private hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const isValid = await this.compare(password, hashedPassword);

    if (!isValid) {
      throw new BadRequestException(ErrorMessage.InvalidCredentials);
    }
    return true;
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await this.hash(registerDto.password);
    const createUser: CreateUserInput = {
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      roles: Role.User,
    };

    try {
      return await this.usersService.create(createUser);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException(ErrorMessage.UserAlreadyExists);
      }

      throw new InternalServerErrorException(error);
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    await this.validatePassword(loginDto.password, String(user.password));
    const accessToken = await this.signToken(user.id, user.email);

    return { user, accessToken };
  }

  async signToken(id: number, email: string): Promise<string> {
    const payload = {
      sub: id,
      email,
    };
    const secret = this.configService.getOrThrow('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: 604800,
      secret: secret,
    });

    return token;
  }
}
