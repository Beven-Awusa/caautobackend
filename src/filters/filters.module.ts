import { Module } from '@nestjs/common';

import {
  CarsMakeController,
  CarsModelController,
  CarsFeatureController,
} from './controllers';
import {
  CarsMakeRepository,
  CarsModelRepository,
  CarsFeatureRepository,
} from './repositories';
import {
  CarsMakeService,
  CarsModelService,
  CarsFeatureService,
} from './services';

@Module({
  controllers: [CarsMakeController, CarsModelController, CarsFeatureController],
  providers: [
    CarsMakeService,
    CarsModelService,
    CarsFeatureService,
    CarsMakeRepository,
    CarsModelRepository,
    CarsFeatureRepository,
  ],
  exports: [
    CarsMakeService,
    CarsModelService,
    CarsFeatureService,
    CarsMakeRepository,
    CarsModelRepository,
    CarsFeatureRepository,
  ],
})
export class FiltersModule {}
