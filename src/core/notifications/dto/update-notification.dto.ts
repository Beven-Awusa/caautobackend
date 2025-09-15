import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsObject, IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({ example: 'message', description: 'Notification type', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'Updated Message', description: 'Notification title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Your message has been updated', description: 'Notification message', required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ 
    example: { messageId: 'msg123', senderId: 'user456' }, 
    description: 'Additional notification data',
    required: false 
  })
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiProperty({ example: true, description: 'Mark notification as read', required: false })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;
}
