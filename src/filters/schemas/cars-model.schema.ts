import { Prisma } from '@prisma/client';

export const CarsModelSelect = {
  id: true,
  makeId: true,
  name: true,
  yearStart: true,
  yearEnd: true,
  isActive: true,
  createdAt: true,
};

export type CarsModel = Prisma.CarModelGetPayload<{
  select: typeof CarsModelSelect;
}>;

export type CarsModelCreateInput = Prisma.CarModelCreateInput;

export type CarsModelUpdateInput = Prisma.CarModelUpdateInput;
