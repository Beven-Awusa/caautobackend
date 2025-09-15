import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({ example: 'user123', description: 'User ID' })
  id: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  lastName: string;

  @ApiProperty({
    example: 'https://example.com/profile.jpg',
    description: 'Profile picture URL',
    required: false,
  })
  profilePicture?: string;
}

export class NotificationResponseDto {
  @ApiProperty({ example: 'notif123', description: 'Notification ID' })
  id: string;

  @ApiProperty({ example: 'user123', description: 'User ID' })
  userId: string;

  @ApiProperty({ example: 'message', description: 'Notification type' })
  type: string;

  @ApiProperty({ example: 'New Message', description: 'Notification title' })
  title: string;

  @ApiProperty({
    example: 'You have received a new message from John Doe',
    description: 'Notification message',
  })
  message: string;

  @ApiProperty({
    example: { messageId: 'msg123', senderId: 'user456' },
    description: 'Additional notification data',
    required: false,
  })
  data?: any;

  @ApiProperty({ example: false, description: 'Read status' })
  isRead: boolean;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'Notification creation date',
  })
  createdAt: Date;

  @ApiProperty({ type: UserInfoDto, description: 'User information' })
  user: UserInfoDto;
}

export class PaginatedNotificationResponseDto {
  @ApiProperty({
    type: [NotificationResponseDto],
    description: 'List of notifications',
  })
  data: NotificationResponseDto[];

  @ApiProperty({ example: 50, description: 'Total number of notifications' })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  page: number;

  @ApiProperty({ example: 10, description: 'Items per page' })
  limit: number;

  @ApiProperty({ example: 5, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Has next page' })
  hasNextPage: boolean;

  @ApiProperty({ example: false, description: 'Has previous page' })
  hasPrevPage: boolean;
}

export class UnreadCountResponseDto {
  @ApiProperty({ example: 5, description: 'Number of unread notifications' })
  count: number;
}
