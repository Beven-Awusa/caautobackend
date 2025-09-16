import { Module } from '@nestjs/common';
import { CarsListingService } from './cars-listing.service';
import { CarsListingController } from './cars-listing.controller';

@Module({
  controllers: [CarsListingController],
  providers: [CarsListingService],
})
export class CarsListingModule {}
