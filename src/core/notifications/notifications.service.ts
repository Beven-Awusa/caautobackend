import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import {
  NotificationPublic,
  NotificationCreateInput,
} from './notification.schema';
import { PaginationResult } from 'src/common/interface';

@Injectable()
export class NotificationsService {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<NotificationPublic> {
    const notificationData: NotificationCreateInput = {
      type: createNotificationDto.type,
      title: createNotificationDto.title,
      message: createNotificationDto.message,
      data: createNotificationDto.data,
      user: {
        connect: { id: createNotificationDto.userId },
      },
    };

    return this.notificationsRepository.create(notificationData);
  }

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

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationPublic> {
    const existingNotification = await this.notificationsRepository.find(id);
    if (!existingNotification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    const updateData: Partial<NotificationCreateInput> = {
      type: updateNotificationDto.type,
      title: updateNotificationDto.title,
      message: updateNotificationDto.message,
      data: updateNotificationDto.data,
    };

    // Remove undefined values
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    return this.notificationsRepository.update(id, updateData);
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

  async markAllAsRead(userId: string): Promise<NotificationPublic[]> {
    return this.notificationsRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationsRepository.getUnreadCount(userId);
  }
}
