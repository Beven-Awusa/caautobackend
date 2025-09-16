import { Test, TestingModule } from '@nestjs/testing';
import { CarsListingService } from './cars-listing.service';

describe('CarsListingService', () => {
  let service: CarsListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarsListingService],
    }).compile();

    service = module.get<CarsListingService>(CarsListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
