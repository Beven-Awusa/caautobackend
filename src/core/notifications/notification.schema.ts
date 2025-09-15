import { Prisma, Notification as PrismaNotification } from '@prisma/client';

export const NotificationsSelect = {
  id: true,
  userId: true,
  type: true,
  title: true,
  message: true,
  data: true,
  isRead: true,
  createdAt: true,
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profilePicture: true,
    },
  },
} as const;

// Notification type with selected fields
export type NotificationPublic = Prisma.NotificationGetPayload<{
  select: typeof NotificationsSelect;
}>;

// Full notification type
export type Notification = PrismaNotification;

// Notification creation type
export type NotificationCreateInput = Prisma.NotificationCreateInput;

// Notification update type
export type NotificationUpdateInput = Prisma.NotificationUpdateInput;
