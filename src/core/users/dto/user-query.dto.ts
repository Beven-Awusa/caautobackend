import { ApiProperty } from '@nestjs/swagger';
import { Role, Status } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UserQueryDto {
  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Items per page',
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    example: 'createdAt',
    description: 'Sort field',
    required: false,
  })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiProperty({ example: 'desc', description: 'Sort order', required: false })
  @IsString()
  @IsOptional()
  order?: string;

  @ApiProperty({
    example: 'BUYER',
    description: 'Filter by role',
    enum: Role,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({
    example: 'ACTIVE',
    description: 'Filter by status',
    enum: Status,
    required: false,
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @ApiProperty({
    example: 'john',
    description: 'Search by name or email',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
