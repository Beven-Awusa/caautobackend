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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCarsModelDto, UpdateCarsModelDto } from '../dto/cars-model.dto';
import { CarsModelService } from '../services';
import { JWTGuard } from 'src/common/guards';

@ApiTags('Filters')
@Controller('filters/models')
@ApiBearerAuth()
@UseGuards(JWTGuard)
export class CarsModelController {
  constructor(private readonly carsModelService: CarsModelService) {}

  @Post()
  @ApiOperation({ summary: 'Create car model' })
  @ApiResponse({
    status: 201,
    description: 'Car model created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarsModelDto: CreateCarsModelDto) {
    return this.carsModelService.create(createCarsModelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all car models with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Car models retrieved successfully',
  })
  findAll() {
    return this.carsModelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car model by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car model retrieved successfully',
  })
  findOne(@Param('id') id: string) {
    return this.carsModelService.findOne(id);
  }

  @Get('/make/:makeId')
  @ApiOperation({ summary: 'Get car models by make ID' })
  @ApiResponse({
    status: 200,
    description: 'Car models retrieved successfully',
  })
  findManyByMakeId(@Param('makeId') id: string) {
    return this.carsModelService.findManyByMakeId(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update car model' })
  @ApiResponse({
    status: 200,
    description: 'Car model updated successfully',
  })
  update(
    @Param('id') id: string,
    @Body() updateCarsModelDto: UpdateCarsModelDto,
  ) {
    return this.carsModelService.update(id, updateCarsModelDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete car model' })
  @ApiResponse({
    status: 200,
    description: 'Car model deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.carsModelService.remove(id);
  }
}
