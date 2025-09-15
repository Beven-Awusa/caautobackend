import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserCreateInput } from './users.schema';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { PaginationResult } from 'src/common/interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userData: UserCreateInput = {
      email: createUserDto.email,
      passwordHash: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phone: createUserDto.phone,
      profilePicture: createUserDto.profilePicture,
      location: createUserDto.location,
      bio: createUserDto.bio,
      role: createUserDto.role,
      status: createUserDto.status,
      googleId: createUserDto.googleId,
    };

    return this.userRepository.create(userData);
  }

  async findAllUsers(query: UserQueryDto): Promise<PaginationResult<User>> {
    const options = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
    };

    return this.userRepository.findAll(options);
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUserByEmail(email);
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findUserByPhone(phone);
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updateData: Partial<UserCreateInput> = {
      email: updateUserDto.email,
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      phone: updateUserDto.phone,
      profilePicture: updateUserDto.profilePicture,
      location: updateUserDto.location,
      bio: updateUserDto.bio,
      role: updateUserDto.role,
      status: updateUserDto.status,
    };

    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    return this.userRepository.updateUser(id, updateData);
  }

  async deleteUser(id: string): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.userRepository.deleteUser(id);
  }
}
