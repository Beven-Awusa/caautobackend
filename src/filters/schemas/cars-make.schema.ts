import { Prisma } from '@prisma/client';

export const CarsMakeSelect = {
  id: true,
  name: true,
  logo: true,
  isActive: true,
  createdAt: true,
};

export type CarsMake = Prisma.CarMakeGetPayload<{
  select: typeof CarsMakeSelect;
}>;

export type CarsMakeCreateInput = Prisma.CarMakeCreateInput;

export type CarsMakeUpdateInput = Prisma.CarMakeUpdateInput;
