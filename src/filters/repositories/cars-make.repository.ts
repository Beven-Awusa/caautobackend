import { Injectable } from '@nestjs/common';
import {
  CarsMake,
  CarsMakeCreateInput,
  CarsMakeUpdateInput,
} from '../schemas/cars-make.schema';
import { CarsMakeRepositoryInterface } from '../interfaces/cars-make.repository.interface';
import { DatabaseService } from 'src/core/database/database.service';
import { CarsMakeSelect } from '../schemas/cars-make.schema';
import { PaginationOptions, PaginationResult } from 'src/common/interface';

@Injectable()
export class CarsMakeRepository implements CarsMakeRepositoryInterface {
  constructor(private database: DatabaseService) {}
  async findAll(options?: PaginationOptions): Promise<
    PaginationResult<{
      id: string;
      name: string;
      logo: string | null;
      isActive: boolean;
      createdAt: Date;
    }>
  > {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [makes, total] = await Promise.all([
      this.database.carMake.findMany({
        skip,
        take: limit,
        select: CarsMakeSelect,
      }),
      this.database.carMake.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: makes,
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

  async create(data: CarsMakeCreateInput): Promise<CarsMake> {
    return this.database.carMake.create({
      data,
      select: CarsMakeSelect,
    });
  }

  async find(id: string): Promise<CarsMake | null> {
    return this.database.carMake.findUnique({
      where: { id },
      select: CarsMakeSelect,
    });
  }

  async findMany(): Promise<CarsMake[]> {
    return this.database.carMake.findMany({
      select: CarsMakeSelect,
    });
  }

  async update(
    id: string,
    data: Partial<CarsMakeUpdateInput>,
  ): Promise<CarsMake> {
    return this.database.carMake.update({
      where: { id },
      data,
      select: CarsMakeSelect,
    });
  }

  async delete(id: string): Promise<CarsMake> {
    return this.database.carMake.delete({
      where: { id },
      select: CarsMakeSelect,
    });
  }

  async findByName(name: string): Promise<CarsMake | null> {
    return this.database.carMake.findUnique({
      where: { name },
      select: CarsMakeSelect,
    });
  }
}
