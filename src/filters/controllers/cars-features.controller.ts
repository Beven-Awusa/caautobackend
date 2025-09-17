import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateCarsFeatureDto,
  UpdateCarsFeatureDto,
} from '../dto/cars-feature.dto';
import { CarsFeatureService } from '../services';

@ApiTags('Filters')
@Controller('filters/features')
export class CarsFeatureController {
  constructor(private readonly carsFeatureService: CarsFeatureService) {}

  @Post()
  @ApiOperation({ summary: 'Create car feature' })
  @ApiResponse({
    status: 201,
    description: 'Car feature created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarsFeatureDto: CreateCarsFeatureDto) {
    return this.carsFeatureService.create(createCarsFeatureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all car features with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Car features retrieved successfully',
  })
  findAll() {
    return this.carsFeatureService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car feature by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car feature retrieved successfully',
  })
  findOne(@Param('id') id: string) {
    return this.carsFeatureService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update car feature' })
  @ApiResponse({
    status: 200,
    description: 'Car feature updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateCarsFeatureDto: UpdateCarsFeatureDto,
  ) {
    return this.carsFeatureService.update(id, updateCarsFeatureDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete car feature' })
  @ApiResponse({
    status: 200,
    description: 'Car feature deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.carsFeatureService.remove(id);
  }
}
