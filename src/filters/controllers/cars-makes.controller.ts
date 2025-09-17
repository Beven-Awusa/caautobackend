import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateCarsMakeDto } from '../dto/cars-make.dto';
import { UpdateCarsMakeDto } from '../dto/cars-make.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CarsMakeService } from '../services';

@ApiTags('Filters')
@Controller('filters/makes')
export class CarsMakeController {
  constructor(private readonly carsMakeService: CarsMakeService) {}

  @Post()
  @ApiOperation({ summary: 'Create car make' })
  @ApiResponse({
    status: 201,
    description: 'Car make created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCarsMakeDto: CreateCarsMakeDto) {
    return this.carsMakeService.create(createCarsMakeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all car makes with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Car makes retrieved successfully',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query: { page?: number; limit?: number }) {
    return this.carsMakeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car make by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car make found',
  })
  @ApiResponse({
    status: 404,
    description: 'Car make not found',
  })
  @ApiParam({ name: 'id', description: 'Car make ID' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.carsMakeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update car make by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car make updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Car make not found',
  })
  @ApiParam({ name: 'id', description: 'Car make ID' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updateCarsMakeDto: UpdateCarsMakeDto,
  ) {
    return this.carsMakeService.update(id, updateCarsMakeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete car make by ID' })
  @ApiResponse({
    status: 200,
    description: 'Car make deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Car make not found',
  })
  @ApiParam({ name: 'id', description: 'Car make ID' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.carsMakeService.remove(id);
  }
}
