import { Prisma } from '@prisma/client';

export const CarsFeatureSelect = {
  id: true,
  name: true,
  category: true,
  isActive: true,
  createdAt: true,
};

export type CarsFeature = Prisma.CarFeatureGetPayload<{
  select: typeof CarsFeatureSelect;
}>;

export type CarsFeatureCreateInput = Prisma.CarFeatureCreateInput;

export type CarsFeatureUpdateInput = Prisma.CarFeatureUpdateInput;
