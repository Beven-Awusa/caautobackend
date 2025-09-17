import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCarsMakeDto {
  @ApiProperty({
    example: 'Audi',
    description: 'Car make name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://example.com/logos/audi.png',
    description: 'Car make logo URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    example: true,
    description: 'Is car make active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateCarsMakeDto {
  @ApiProperty({
    example: 'Audi',
    description: 'Car make name',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'https://example.com/logos/audi.png',
    description: 'Car make logo URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    example: true,
    description: 'Is car make active',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
