import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ListingStatus } from '@prisma/client';

export class UpdateListingDto {
  @ApiProperty({ example: 'BMW 3 Series 2020', description: 'Listing title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Detailed car description',
    description: 'Listing description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 25000, description: 'Car price' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 50000, description: 'Car mileage', required: false })
  @IsNumber()
  @IsOptional()
  mileage?: number;

  @ApiProperty({
    example: 2.0,
    description: 'Engine size in liters',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  engine_size?: number;

  @ApiProperty({
    example: 4,
    description: 'Number of cylinders',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  cylinders?: number;

  @ApiProperty({ example: 4, description: 'Number of doors', required: false })
  @IsNumber()
  @IsOptional()
  doors?: number;

  @ApiProperty({ example: 5, description: 'Number of seats', required: false })
  @IsNumber()
  @IsOptional()
  seats?: number;

  @ApiProperty({
    example: 'Black',
    description: 'Exterior color',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: 'Beige',
    description: 'Interior color',
    required: false,
  })
  @IsString()
  @IsOptional()
  interior_color?: string;

  @ApiProperty({
    enum: ListingStatus,
    description: 'Listing status',
    default: 'PENDING',
    required: false,
  })
  @IsEnum(ListingStatus)
  @IsOptional()
  status?: ListingStatus;

  @ApiProperty({
    example: false,
    description: 'Featured listing',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty({
    example: 'New York, NY',
    description: 'Location',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example: 40.7128,
    description: 'Latitude coordinate',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiProperty({
    example: -74.006,
    description: 'Longitude coordinate',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiProperty({ type: [String], description: 'Feature IDs', required: false })
  @IsArray()
  @IsOptional()
  feature_ids?: string[];
  @ApiProperty({
    example: 2020,
    description: 'Car manufacturing year',
    required: false,
  })
  year?: number;
}
