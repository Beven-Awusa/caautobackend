import { PaginationOptions, PaginationResult } from 'src/common/interface';
import {
  NotificationCreateInput,
  NotificationPublic,
} from './notification.schema';

export interface NotificationsRepositoryInterface {
  create(data: NotificationCreateInput): Promise<NotificationPublic>;
  find(id: string): Promise<NotificationPublic | null>;
  findAll(
    options?: PaginationOptions,
  ): Promise<PaginationResult<NotificationPublic>>;
  update(
    id: string,
    data: Partial<NotificationCreateInput>,
  ): Promise<NotificationPublic>;
  delete(id: string): Promise<NotificationPublic>;
  markAsRead(id: string): Promise<NotificationPublic>;

  markAllAsRead(userId: string): Promise<NotificationPublic[]>;
  getUnreadCount(userId: string): Promise<number>;
  getNotificationPublicsForUser(
    userId: string,
    options?: PaginationOptions,
  ): Promise<PaginationResult<NotificationPublic>>;
}
