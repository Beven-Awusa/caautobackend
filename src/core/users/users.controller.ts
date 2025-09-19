import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import {
  UserResponseDto,
  PaginatedUserResponseDto,
} from './dto/user-response.dto';
import { JWTGuard } from 'src/common/guards';
import { Role } from 'src/common/decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JWTGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - User already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  @Role(['ADMIN'])
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return user;
  }

  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: PaginatedUserResponseDto,
  })
  @Get()
  async findAll(@Query() query: UserQueryDto) {
    const result = await this.usersService.findAllUsers(query);
    return result;
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    return user;
  }

  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.updateUser(id, updateUserDto);
    return user;
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @Delete(':id')
  @Role(['ADMIN'])
  async remove(@Param('id') id: string) {
    const user = await this.usersService.deleteUser(id);
    return user;
  }

  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiQuery({ name: 'email', description: 'User email' })
  @Get('email/search')
  @Role(['ADMIN'])
  async findByEmail(@Query('email') email: string) {
    const user = await this.usersService.findUserByEmail(email);
    return user;
  }
}
