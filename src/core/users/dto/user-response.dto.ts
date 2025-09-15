import { ApiProperty } from '@nestjs/swagger';
import { Role, Status } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({ example: 'cuid123', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number', required: false })
  phone?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', description: 'Profile picture URL', required: false })
  profilePicture?: string;

  @ApiProperty({ example: 'New York, NY', description: 'User location', required: false })
  location?: string;

  @ApiProperty({ example: 'Car enthusiast and collector', description: 'User bio', required: false })
  bio?: string;

  @ApiProperty({ example: 'BUYER', description: 'User role', enum: Role })
  role: Role;

  @ApiProperty({ example: 'ACTIVE', description: 'User status', enum: Status })
  status: Status;

  @ApiProperty({ example: true, description: 'Email verification status' })
  emailVerified: boolean;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User creation date' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User last update date' })
  updatedAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'User last login date', required: false })
  lastLogin?: Date;
}

export class PaginatedUserResponseDto {
  @ApiProperty({ type: [UserResponseDto], description: 'List of users' })
  items: UserResponseDto[];

  @ApiProperty({ example: 100, description: 'Total number of users' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Has next page' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Has previous page' })
  hasPrevPage: boolean;
}
