import { Injectable } from '@nestjs/common';
import {
  CarsModel,
  CarsModelCreateInput,
  CarsModelUpdateInput,
} from '../schemas/cars-model.schema';
import { CarsModelRepositoryInterface } from '../interfaces/cars-model.repository.interface';
import { DatabaseService } from 'src/core/database/database.service';
import { CarsModelSelect } from '../schemas/cars-model.schema';
import { PaginationOptions, PaginationResult } from 'src/common/interface';

@Injectable()
export class CarsModelRepository implements CarsModelRepositoryInterface {
  constructor(private database: DatabaseService) {}
  async findAll(options?: PaginationOptions): Promise<
    PaginationResult<{
      id: string;
      makeId: string;
      name: string;
      yearStart: number | null;
      yearEnd: number | null;
      isActive: boolean;
      createdAt: Date;
    }>
  > {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    const [models, total] = await Promise.all([
      this.database.carModel.findMany({
        skip,
        take: limit,
        select: CarsModelSelect,
      }),
      this.database.carModel.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: models,
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

  async create(data: CarsModelCreateInput): Promise<CarsModel> {
    const model = await this.database.carModel.create({
      data,
      select: CarsModelSelect,
    });
    return model;
  }

  async findMany(): Promise<CarsModel[]> {
    return this.database.carModel.findMany({
      select: CarsModelSelect,
    });
  }

  async findManyByMakeId(makeId: string): Promise<CarsModel[]> {
    return this.database.carModel.findMany({
      where: { makeId },
      select: CarsModelSelect,
    });
  }

  async find(id: string): Promise<CarsModel | null> {
    return this.database.carModel.findUnique({
      where: { id },
      select: CarsModelSelect,
    });
  }

  async findByName(name: string): Promise<CarsModel | null> {
    return this.database.carModel.findFirst({
      where: { name },
      select: CarsModelSelect,
    });
  }

  async update(
    id: string,
    data: Partial<CarsModelUpdateInput>,
  ): Promise<CarsModel> {
    return this.database.carModel.update({
      where: { id },
      data,
      select: CarsModelSelect,
    });
  }

  async delete(id: string): Promise<CarsModel> {
    return this.database.carModel.delete({
      where: { id },
      select: CarsModelSelect,
    });
  }
}
