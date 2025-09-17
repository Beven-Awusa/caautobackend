import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateCarsModelDto {
  @ApiProperty({
    example: '1',
    description: 'Car make ID',
  })
  @IsString()
  make_id: string;

  @ApiProperty({
    example: 'V60',
    description: 'Car model name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 2018,
    description: 'Model year start',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  year_start?: number;

  @ApiProperty({
    example: 2023,
    description: 'Model year end',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  year_end?: number;

  @ApiProperty({
    example: true,
    description: 'Is car model active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateCarsModelDto {
  @ApiProperty({
    example: '1',
    description: 'Car make ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  make_id?: string;

  @ApiProperty({
    example: 'V60',
    description: 'Car model name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 2018,
    description: 'Model year start',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  year_start?: number;

  @ApiProperty({
    example: 2023,
    description: 'Model year end',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  year_end?: number;

  @ApiProperty({
    example: true,
    description: 'Is car model active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
