import { Injectable } from '@nestjs/common';
import {
  CarsFeature,
  CarsFeatureCreateInput,
  CarsFeatureUpdateInput,
} from '../schemas/cars-feature.schema';
import { CarsFeatureRepositoryInterface } from '../interfaces/cars-feature.repository.interface';
import { DatabaseService } from 'src/core/database/database.service';
import { CarsFeatureSelect } from '../schemas/cars-feature.schema';
import { PaginationOptions, PaginationResult } from 'src/common/interface';

@Injectable()
export class CarsFeatureRepository implements CarsFeatureRepositoryInterface {
  constructor(private database: DatabaseService) {}
  async findAll(options?: PaginationOptions): Promise<
    PaginationResult<{
      id: string;
      name: string;
      category: string;
      isActive: boolean;
      createdAt: Date;
    }>
  > {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [features, total] = await Promise.all([
      this.database.carFeature.findMany({
        skip,
        take: limit,
        select: CarsFeatureSelect,
      }),
      this.database.carFeature.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: features,
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

  async create(data: CarsFeatureCreateInput): Promise<CarsFeature> {
    return this.database.carFeature.create({
      data,
      select: CarsFeatureSelect,
    });
  }

  async findMany(): Promise<CarsFeature[]> {
    return this.database.carFeature.findMany({
      select: CarsFeatureSelect,
    });
  }
  async find(id: string): Promise<CarsFeature | null> {
    return this.database.carFeature.findUnique({
      where: { id },
      select: CarsFeatureSelect,
    });
  }

  async findByName(name: string): Promise<CarsFeature | null> {
    return this.database.carFeature.findUnique({
      where: { name },
      select: CarsFeatureSelect,
    });
  }

  async update(
    id: string,
    data: Partial<CarsFeatureUpdateInput>,
  ): Promise<CarsFeature> {
    return this.database.carFeature.update({
      where: { id },
      data,
      select: CarsFeatureSelect,
    });
  }

  async delete(id: string): Promise<CarsFeature> {
    return this.database.carFeature.delete({
      where: { id },
      select: CarsFeatureSelect,
    });
  }
}
