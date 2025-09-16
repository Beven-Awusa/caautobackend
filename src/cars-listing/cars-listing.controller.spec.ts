import { Test, TestingModule } from '@nestjs/testing';
import { CarsListingController } from './cars-listing.controller';
import { CarsListingService } from './cars-listing.service';

describe('CarsListingController', () => {
  let controller: CarsListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsListingController],
      providers: [CarsListingService],
    }).compile();

    controller = module.get<CarsListingController>(CarsListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
