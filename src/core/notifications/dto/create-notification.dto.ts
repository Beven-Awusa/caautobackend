import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'user123', description: 'User ID to send notification to' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'message', description: 'Notification type' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'New Message', description: 'Notification title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'You have received a new message from John Doe', description: 'Notification message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ 
    example: { messageId: 'msg123', senderId: 'user456' }, 
    description: 'Additional notification data',
    required: false 
  })
  @IsObject()
  @IsOptional()
  data?: any;
}
