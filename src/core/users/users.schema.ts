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
};

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
