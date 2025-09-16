import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { NotificationPublic } from './notification.schema';
import { PaginationResult } from 'src/common/interface';
import { EmailService } from '../email/email.service';
import { UserRepository } from '../users/user.repository';

@Injectable()
export class NotificationsService {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private readonly emailService: EmailService,
    private readonly usersRepository: UserRepository,
  ) {}

  async findAllNotifications(
    query: NotificationQueryDto,
  ): Promise<PaginationResult<NotificationPublic>> {
    const options = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
    };

    return this.notificationsRepository.findAll(options);
  }

  async findNotificationById(id: string): Promise<NotificationPublic> {
    const notification = await this.notificationsRepository.find(id);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async getNotificationsForUser(
    userId: string,
    query: NotificationQueryDto,
  ): Promise<PaginationResult<NotificationPublic>> {
    const options = {
      page: query.page,
      limit: query.limit,
      sort: query.sort,
      order: query.order,
    };

    return this.notificationsRepository.getNotificationPublicsForUser(
      userId,
      options,
    );
  }

  async deleteNotification(id: string): Promise<NotificationPublic> {
    const existingNotification = await this.notificationsRepository.find(id);
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.notificationsRepository.delete(id);
  }

  async markAsRead(id: string): Promise<NotificationPublic> {
    const existingNotification = await this.notificationsRepository.find(id);
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.notificationsRepository.markAsRead(id);
  }

  async markAllAsRead(userId: string) {
    try {
      const user = await this.usersRepository.findUserById(userId);
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const notifications =
        await this.notificationsRepository.markAllAsRead(userId);

      return notifications;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      return this.notificationsRepository.getUnreadCount(userId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async testEmail(email: string) {
    try {
      console.log(email);

      const message = await this.emailService.sendWelcomeEmail(
        email,
        'Test Email User',
      );

      return message;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async testToken(email: string) {
    try {
      // const user = await this.usersRepository.findUserByEmail(email);
      // if (!user) throw new NotFoundException('User not found');

      const token = '123456'; // For testing purposes

      await this.emailService.sendOtpEmail(
        email,
        'Test Token',
        token,
        'This is a test OTP email.',
      );

      return { message: 'Test OTP email sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
