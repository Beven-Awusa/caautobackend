import { Prisma } from '@prisma/client';
export const ListingsSelect = {
  id: true,
  userId: true,
  title: true,
  description: true,
  make: {
    select: {
      id: true,
      name: true,
    },
  },
  model: {
    select: {
      id: true,
      name: true,
    },
  },
  year: true,
  condition: true,
  price: true,
  mileage: true,
  fuelType: true,
  transmission: true,
  driveType: true,
  primaryImage: true,
  galleryImages: true,
  status: true,
  featured: true,
  viewsCount: true,
  favoritesCount: true,
  location: true,
  createdAt: true,
  updatedAt: true,
};
export type Listings = Prisma.CarListingGetPayload<{
  select: typeof ListingsSelect;
}>;

export type ListingsCreateInput = Prisma.CarListingCreateInput;

export type ListingsUpdateInput = Prisma.CarListingUpdateInput;
