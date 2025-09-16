import { PartialType } from '@nestjs/swagger';
import { CreateCarsListingDto } from './create-cars-listing.dto';

export class UpdateCarsListingDto extends PartialType(CreateCarsListingDto) {}
