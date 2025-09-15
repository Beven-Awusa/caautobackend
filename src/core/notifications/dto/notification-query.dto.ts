import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class NotificationQueryDto {
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
    example: 'message',
    description: 'Filter by notification type',
    required: false,
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    example: false,
    description: 'Filter by read status',
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
