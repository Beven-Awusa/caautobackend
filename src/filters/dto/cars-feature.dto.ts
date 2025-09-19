import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCarsFeatureDto {
  @ApiProperty({
    example: 'Sunroof',
    description: 'Car feature name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Exterior',
    description: 'Feature category',
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: true,
    description: 'Is feature active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateCarsFeatureDto {
  @ApiProperty({
    example: 'Sunroof',
    description: 'Car feature name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Exterior',
    description: 'Feature category',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: true,
    description: 'Is feature active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
