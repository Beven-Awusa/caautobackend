import { BaseRepository } from 'src/common/interface';
import {
  CarsModel,
  CarsModelCreateInput,
  CarsModelUpdateInput,
} from '../schemas/cars-model.schema';

export interface CarsModelRepositoryInterface
  extends BaseRepository<
    CarsModel,
    CarsModelCreateInput,
    CarsModelUpdateInput
  > {
  findByName(name: string): Promise<CarsModel | null>;
  findMany(): Promise<CarsModel[]>;
  findManyByMakeId(makeId: string): Promise<CarsModel[]>;
}
