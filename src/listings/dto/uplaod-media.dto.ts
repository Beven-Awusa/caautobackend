import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UploadMediaDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Image files',
  })
  @IsArray()
  @IsOptional()
  images?: Express.Multer.File[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Video files',
  })
  @IsArray()
  @IsOptional()
  videos?: Express.Multer.File[];

  @ApiProperty({
    example: true,
    description: 'Set primary image',
    required: false,
  })
  @IsOptional()
  set_primary: boolean;
}
