import { BaseRepository } from 'src/common/interface';
import { CarsMake } from '../schemas/cars-make.schema';
import {
  CarsMakeCreateInput,
  CarsMakeUpdateInput,
} from '../schemas/cars-make.schema';
export interface CarsMakeRepositoryInterface
  extends BaseRepository<CarsMake, CarsMakeCreateInput, CarsMakeUpdateInput> {
  findByName(name: string): Promise<CarsMake | null>;
  findMany(): Promise<CarsMake[]>;
}
