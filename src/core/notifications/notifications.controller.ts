import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { NotificationQueryDto } from './dto/notification-query.dto';
import {
  NotificationResponseDto,
  PaginatedNotificationResponseDto,
  UnreadCountResponseDto,
} from './dto/notification-response.dto';
import { ResendOtpDto } from '../auth/dto/resend-token.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({
    summary: 'Get all notifications with pagination and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications retrieved successfully',
    type: PaginatedNotificationResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    type: String,
    description: 'Sort order (asc/desc)',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by notification type',
  })
  @ApiQuery({
    name: 'isRead',
    required: false,
    type: Boolean,
    description: 'Filter by read status',
  })
  @Get()
  findAll(@Query() query: NotificationQueryDto) {
    return this.notificationsService.findAllNotifications(query);
  }

  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification found',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findNotificationById(id);
  }

  @ApiOperation({ summary: 'Get notifications for a specific user' })
  @ApiResponse({
    status: 200,
    description: 'User notifications retrieved successfully',
    type: PaginatedNotificationResponseDto,
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    description: 'Filter by notification type',
  })
  @ApiQuery({
    name: 'isRead',
    required: false,
    type: Boolean,
    description: 'Filter by read status',
  })
  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query() query: NotificationQueryDto,
  ) {
    return this.notificationsService.getNotificationsForUser(userId, query);
  }

  @ApiOperation({ summary: 'Get unread notification count for a user' })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    type: UnreadCountResponseDto,
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @Get('user/:userId/unread-count')
  async getUnreadCount(
    @Param('userId') userId: string,
  ): Promise<UnreadCountResponseDto> {
    const count = await this.notificationsService.getUnreadCount(userId);
    return { count };
  }

  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read',
    type: [NotificationResponseDto],
  })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @Patch('user/:userId/read-all')
  markAllAsRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @ApiOperation({ summary: 'Delete notification by ID' })
  @ApiResponse({
    status: 200,
    description: 'Notification deleted successfully',
    type: NotificationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found',
  })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.deleteNotification(id);
  }

  @ApiOperation({ summary: 'Test email' })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
  })
  @Post('test-email')
  async testEmail(@Body() dto: ResendOtpDto) {
    await this.notificationsService.testEmail(dto.email);
  }

  @ApiOperation({ summary: 'Test token generation' })
  @ApiResponse({
    status: 200,
    description: 'Token generated successfully',
  })
  @Post('test-token')
  async testToken(@Body() dto: ResendOtpDto) {
    return this.notificationsService.testToken(dto.email);
  }
}
