import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  CarCondition,
  DriveType,
  FuelType,
  ListingStatus,
  TransmissionType,
} from '@prisma/client';

export class CreateListingDto {
  @ApiProperty({ example: 'BMW 3 Series 2020', description: 'Listing title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Detailed car description',
    description: 'Listing description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '123', description: 'Car make ID' })
  @IsString()
  @IsNotEmpty()
  make_id: string;

  @ApiProperty({ example: '456', description: 'Car model ID' })
  @IsString()
  @IsNotEmpty()
  model_id: string;

  @ApiProperty({ example: 2020, description: 'Car manufacturing year' })
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ enum: CarCondition, description: 'Car condition' })
  @IsEnum(CarCondition)
  @IsNotEmpty()
  condition: CarCondition;

  @ApiProperty({ example: 25000, description: 'Car price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ example: 50000, description: 'Car mileage', required: false })
  @IsNumber()
  @IsOptional()
  mileage?: number;

  @ApiProperty({ enum: FuelType, description: 'Fuel type' })
  @IsEnum(FuelType)
  @IsNotEmpty()
  fuel_type: FuelType;

  @ApiProperty({ enum: TransmissionType, description: 'Transmission type' })
  @IsEnum(TransmissionType)
  @IsNotEmpty()
  transmission: TransmissionType;

  @ApiProperty({ enum: DriveType, description: 'Drive type' })
  @IsEnum(DriveType)
  @IsNotEmpty()
  drive_type: DriveType;

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
  @IsOptional()
  @IsString()
  interior_color?: string;

  @ApiProperty({
    example: '1HGCM82633A123456',
    description: 'Vehicle identification number',
    required: false,
  })
  @IsString()
  @IsOptional()
  vin?: string;

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

  @ApiProperty({
    example: '+1234567890',
    description: 'Contact phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  contact_phone?: string;

  @ApiProperty({
    example: 'contact@example.com',
    description: 'Contact email',
    required: false,
  })
  @IsString()
  @IsEmail()
  @IsOptional()
  contact_email?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Primary image file',
  })
  @IsOptional()
  primary_image?: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Gallery image files',
  })
  @IsOptional()
  gallery_images?: string[];

  @ApiProperty({ type: [String], description: 'Video URLs', required: false })
  @IsArray()
  @IsOptional()
  videos?: string[];

  @ApiProperty({ type: [String], description: 'Feature IDs', required: false })
  @IsArray()
  @IsOptional()
  feature_ids?: string[];
}
