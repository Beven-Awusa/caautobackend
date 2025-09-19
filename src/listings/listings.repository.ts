import { Injectable } from '@nestjs/common';
import {
  Listings,
  ListingsCreateInput,
  ListingsUpdateInput,
} from './listings.schema';
import { CarListingParams } from './interface/params.interface';
import { PaginationResult } from '../.../../common/interface';
import { ListingsRepositoryInterface } from './interface/listings.repository.interface';
import { ListingsSelect } from './listings.schema';
import { DatabaseService } from '../core/database/database.service';

import { Prisma } from '@prisma/client';

@Injectable()
export class ListingsRepository implements ListingsRepositoryInterface {
  constructor(private database: DatabaseService) {}
  async search(
    query: string,
    limit: number = 10,
    page: number = 1,
  ): Promise<Listings[]> {
    return this.database.carListing.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { make: { name: { contains: query, mode: 'insensitive' } } },
          { model: { name: { contains: query, mode: 'insensitive' } } },
          { location: { contains: query, mode: 'insensitive' } },
          { vin: { contains: query, mode: 'insensitive' } },
          { color: { contains: query, mode: 'insensitive' } },
          { interiorColor: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip: (page - 1) * limit,
      select: ListingsSelect,
    });
  }
  delete(id: string): Promise<Listings> {
    return this.database.carListing.delete({
      where: { id },
      select: ListingsSelect,
    });
  }

  async create(data: ListingsCreateInput): Promise<Listings> {
    return this.database.carListing.create({
      data,
      select: ListingsSelect,
    });
  }

  async find(id: string): Promise<Listings | null> {
    return this.database.carListing.findUnique({
      where: { id },
      select: ListingsSelect,
    });
  }

  async findAll(
    options?: CarListingParams,
  ): Promise<PaginationResult<Listings>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    const sort = options?.sort || 'createdAt';
    const order = options?.order || 'desc';
    const where: Prisma.CarListingWhereInput = {};

    if (options?.make_id) where.makeId = options.make_id;

    if (options?.model_id) where.modelId = options.model_id;

    if (options?.year_min || options?.year_max) {
      where.year = {};
      if (options.year_min) where.year.gte = options.year_min;
      if (options.year_max) where.year.lte = options.year_max;
    }

    if (options?.price_min || options?.price_max) {
      where.price = {};
      if (options.price_min) where.price.gte = options.price_min;
      if (options.price_max) where.price.lte = options.price_max;
    }

    if (options?.condition) where.condition = options.condition;

    if (options?.fuel_type) where.fuelType = options.fuel_type;

    if (options?.transmission) where.transmission = options.transmission;

    if (options?.featured !== undefined) where.featured = options.featured;

    if (options?.search) {
      where.OR = [
        { make: { name: { contains: options.search, mode: 'insensitive' } } },
        { model: { name: { contains: options.search, mode: 'insensitive' } } },
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
      ];
    }

    const [listings, total] = await Promise.all([
      this.database.carListing.findMany({
        skip,
        take: limit,
        where,
        select: ListingsSelect,
        orderBy: { [sort]: order },
      }),
      this.database.carListing.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: listings,
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
    data: Partial<ListingsUpdateInput>,
  ): Promise<Listings> {
    return this.database.carListing.update({
      where: { id },
      data,
      select: ListingsSelect,
    });
  }
}
