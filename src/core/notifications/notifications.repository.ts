import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  NotificationCreateInput,
  NotificationPublic,
  NotificationsSelect,
} from './notification.schema';
import { PaginationOptions, PaginationResult } from 'src/common/interface';
import { NotificationsRepositoryInterface } from './notifications.repository.interface';

@Injectable()
export class NotificationsRepository
  implements NotificationsRepositoryInterface
{
  constructor(private database: DatabaseService) {}

  async create(data: NotificationCreateInput): Promise<NotificationPublic> {
    const notification = await this.database.notification.create({
      data,
      select: NotificationsSelect,
    });
    return notification;
  }

  async find(id: string): Promise<NotificationPublic | null> {
    const notification = await this.database.notification.findUnique({
      where: { id },
      select: NotificationsSelect,
    });
    return notification;
  }

  async findAll(
    options?: PaginationOptions,
  ): Promise<PaginationResult<NotificationPublic>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.database.notification.findMany({
        skip,
        take: limit,
        select: NotificationsSelect,
      }),
      this.database.notification.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async update(
    id: string,
    data: Partial<NotificationCreateInput>,
  ): Promise<NotificationPublic> {
    const notification = await this.database.notification.update({
      where: { id },
      select: NotificationsSelect,
      data,
    });
    return notification;
  }

  async delete(id: string): Promise<NotificationPublic> {
    const notification = await this.database.notification.delete({
      where: { id },
      select: NotificationsSelect,
    });
    return notification;
  }

  async getNotificationPublicsForUser(
    userId: string,
    options?: PaginationOptions,
  ): Promise<PaginationResult<NotificationPublic>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.database.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        select: NotificationsSelect,
        orderBy: { createdAt: 'desc' },
      }),
      this.database.notification.count({
        where: { userId },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async markAsRead(id: string): Promise<NotificationPublic> {
    const notification = await this.database.notification.update({
      where: { id },
      data: { isRead: true },
      select: NotificationsSelect,
    });
    return notification;
  }

  async markAllAsRead(userId: string): Promise<any> {
    const notifications = await this.database.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return notifications;
  }

  async getUnreadCount(userId: string): Promise<number> {
    const notification = await this.database.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
    return notification;
  }
}
