import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Token, User, UserCreateInput } from './users.schema';
import {
  PaginationOptions,
  PaginationResult,
} from 'src/common/interface/pagination.interface';
import { UserRepositoryInterface } from './user.repository.interface';
import { generateOTP } from 'src/common/utils';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private database: DatabaseService) {}
  async findToken(token: string): Promise<Token | null> {
    const result = await this.database.otp.findUnique({
      where: { token },
      select: {
        token: true,
        expiresAt: true,
        createdAt: true,
        userId: true,
      },
    });
    return result;
  }

  async create(data: UserCreateInput): Promise<User> {
    return this.database.user.create({ data });
  }

  async createToken(userId: string): Promise<Token> {
    const { token, expiresIn } = generateOTP();
    const newToken = await this.database.otp.create({
      data: {
        token,
        expiresAt: expiresIn,
        user: { connect: { id: userId } },
      },
      select: {
        token: true,
        expiresAt: true,
        createdAt: true,
        userId: true,
      },
    });
    return newToken;
  }

  async deleteToken(token: string): Promise<Token> {
    return this.database.otp.delete({
      where: { token },
    });
  }

  async find(id: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { id },
    });
  }

  async findAll(options?: PaginationOptions): Promise<PaginationResult<User>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.database.user.findMany({
        skip,
        take: limit,
      }),
      this.database.user.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: users,
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.database.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return this.database.user.delete({
      where: { id },
    });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { id },
    });
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    return this.database.user.findFirst({
      where: { phone },
    });
  }

  async findUserByGoogleId(googleId: string): Promise<User | null> {
    return this.database.user.findFirst({
      where: { googleId },
    });
  }

  async updateUser(id: string, data: Partial<UserCreateInput>): Promise<User> {
    return this.database.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.database.user.delete({
      where: { id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.database.user.findUnique({
      where: { email },
    });
  }
}
