import { Prisma, User as PrismaUser } from '@prisma/client';

export const UsersSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  profilePicture: true,
  location: true,
  bio: true,
  role: true,
  status: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
  googleId: true,
  refreshToken: true,
  refreshTokenExpiry: true,
  socialLinks: true,
  carListings: true,
  favorites: true,
  views: true,
  sentMessages: true,
  receivedMessages: true,
  user1Threads: true,
  user2Threads: true,
  blogPosts: true,
  blogComments: true,
  shoppingCart: true,
  orders: true,
  reviews: true,
  searchHistory: true,
  notifications: true,
  subscriptions: true,
};

export type Token = Prisma.OtpGetPayload<{
  select: {
    token: true;
    expiresAt: true;
    createdAt: true;
    userId: true;
  };
}>;
export type TokenCreateInput = Prisma.OtpCreateInput;

// User type with selected fields
export type UserPublic = Prisma.UserGetPayload<{
  select: typeof UsersSelect;
}>;

// Full user type
export type User = PrismaUser;

// User creation type
export type UserCreateInput = Prisma.UserCreateInput;

// User update type
export type UserUpdateInput = Prisma.UserUpdateInput;
