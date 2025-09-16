import { Injectable } from '@nestjs/common';
import { CreateCarsListingDto } from './dto/create-cars-listing.dto';
import { UpdateCarsListingDto } from './dto/update-cars-listing.dto';

@Injectable()
export class CarsListingService {
  create(createCarsListingDto: CreateCarsListingDto) {
    return 'This action adds a new carsListing';
  }

  findAll() {
    return `This action returns all carsListing`;
  }

  findOne(id: number) {
    return `This action returns a #${id} carsListing`;
  }

  update(id: number, updateCarsListingDto: UpdateCarsListingDto) {
    return `This action updates a #${id} carsListing`;
  }

  remove(id: number) {
    return `This action removes a #${id} carsListing`;
  }
}
