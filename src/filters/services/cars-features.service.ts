import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CarsFeatureRepository } from '../repositories/cars-feature.repository';
import { CreateCarsFeatureDto } from '../dto/cars-feature.dto';
import { UpdateCarsFeatureDto } from '../dto/cars-feature.dto';

@Injectable()
export class CarsFeatureService {
  constructor(private carsFeatureRepository: CarsFeatureRepository) {}

  async create(createCarsFeatureDto: CreateCarsFeatureDto) {
    try {
      return await this.carsFeatureRepository.create({
        name: createCarsFeatureDto.name,
        category: createCarsFeatureDto.category,
        isActive: createCarsFeatureDto.is_active,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.carsFeatureRepository.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByName(name: string) {
    try {
      const feature = await this.carsFeatureRepository.findByName(name);
      if (!feature)
        throw new NotFoundException(`Car feature with name ${name} not found`);
      return feature;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const feature = await this.carsFeatureRepository.find(id);
      if (!feature)
        throw new NotFoundException(`Car feature with ID ${id} not found`);
      return feature;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCarsFeatureDto: UpdateCarsFeatureDto) {
    try {
      const feature = await this.carsFeatureRepository.find(id);
      if (!feature)
        throw new NotFoundException(`Car feature with ID ${id} not found`);

      return await this.carsFeatureRepository.update(id, {
        name: updateCarsFeatureDto.name,
        category: updateCarsFeatureDto.category,
        isActive: updateCarsFeatureDto.is_active,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const feature = await this.carsFeatureRepository.find(id);
      if (!feature)
        throw new NotFoundException(`Car feature with ID ${id} not found`);

      return await this.carsFeatureRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
