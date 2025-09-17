import { CarCondition, FuelType, TransmissionType } from '@prisma/client';

export interface CarListingParams {
  page?: number;
  limit?: number;
  sort?: 'price' | 'year' | 'createdAt' | 'viewCount';
  order?: 'asc' | 'desc';
  make_id?: string;
  model_id?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  condition?: CarCondition;
  fuel_type?: FuelType;
  transmission?: TransmissionType;
  featured?: boolean;
  status?: 'active' | 'pending' | 'sold' | 'draft';
  search?: string;
}
