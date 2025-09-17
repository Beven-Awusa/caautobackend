import { BaseRepository } from 'src/common/interface';
import { CarsFeature } from '../schemas/cars-feature.schema';
import {
  CarsFeatureCreateInput,
  CarsFeatureUpdateInput,
} from '../schemas/cars-feature.schema';

export interface CarsFeatureRepositoryInterface
  extends BaseRepository<
    CarsFeature,
    CarsFeatureCreateInput,
    CarsFeatureUpdateInput
  > {
  findByName(name: string): Promise<CarsFeature | null>;
  findMany(): Promise<CarsFeature[]>;
}
