import { CarCondition, FuelType, TransmissionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CarListingQueryParams {
  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Items per page',
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number = 10;

  @ApiProperty({
    example: 'price',
    description: 'Sort field',
    required: false,
  })
  @IsString()
  @IsOptional()
  sort?: 'price' | 'year' | 'createdAt' | 'viewCount';

  @ApiProperty({
    example: 'desc',
    description: 'Sort order',
    required: false,
  })
  @IsString()
  @IsOptional()
  order?: 'asc' | 'desc';

  @ApiProperty({
    example: 'make123',
    description: 'Filter by make ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  make_id?: string;

  @ApiProperty({
    example: 'model123',
    description: 'Filter by model ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  model_id?: string;

  @ApiProperty({ example: 2015, description: 'Minimum year', required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  year_min?: number;

  @ApiProperty({ example: 2023, description: 'Maximum year', required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  year_max?: number;

  @ApiProperty({ example: 5000, description: 'Minimum price', required: false })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price_min?: number;

  @ApiProperty({
    example: 50000,
    description: 'Maximum price',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  price_max?: number;

  @ApiProperty({
    enum: CarCondition,
    description: 'Filter by car condition',
    required: false,
  })
  @IsEnum(CarCondition)
  @IsOptional()
  condition?: CarCondition;

  @ApiProperty({
    enum: FuelType,
    description: 'Filter by fuel type',
    required: false,
  })
  @IsEnum(FuelType)
  @IsOptional()
  fuel_type?: FuelType;

  @ApiProperty({
    enum: TransmissionType,
    description: 'Filter by transmission type',
    required: false,
  })
  @IsEnum(TransmissionType)
  @IsOptional()
  transmission?: TransmissionType;

  @ApiProperty({
    example: true,
    description: 'Filter featured listings',
    required: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @ApiProperty({
    example: 'active',
    description: 'Filter by listing status',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: 'active' | 'pending' | 'sold' | 'draft';

  @ApiProperty({
    example: 'Toyota Camry',
    description: 'Search term',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}
