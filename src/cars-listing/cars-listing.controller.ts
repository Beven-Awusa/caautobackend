import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarsListingService } from './cars-listing.service';
import { CreateCarsListingDto } from './dto/create-cars-listing.dto';
import { UpdateCarsListingDto } from './dto/update-cars-listing.dto';

@Controller('cars-listing')
export class CarsListingController {
  constructor(private readonly carsListingService: CarsListingService) {}

  @Post()
  create(@Body() createCarsListingDto: CreateCarsListingDto) {
    return this.carsListingService.create(createCarsListingDto);
  }

  @Get()
  findAll() {
    return this.carsListingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsListingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCarsListingDto: UpdateCarsListingDto) {
    return this.carsListingService.update(+id, updateCarsListingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsListingService.remove(+id);
  }
}
