import { ApiProperty } from '@nestjs/swagger';
import { Role, Status } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+1234567890', description: 'User phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg', description: 'Profile picture URL', required: false })
  @IsString()
  @IsOptional()
  profilePicture?: string;

  @ApiProperty({ example: 'New York, NY', description: 'User location', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'Car enthusiast and collector', description: 'User bio', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'BUYER', description: 'User role', enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: 'ACTIVE', description: 'User status', enum: Status })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiProperty({ example: 'google123', description: 'Google ID for OAuth', required: false })
  @IsString()
  @IsOptional()
  googleId?: string;
}
