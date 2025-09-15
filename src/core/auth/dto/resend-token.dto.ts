import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({ example: 'john.doe@gmail.com', description: 'User email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
