import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CarsMakeRepository } from '../repositories/cars-make.repository';
import { CreateCarsMakeDto } from '../dto/cars-make.dto';
import { UpdateCarsMakeDto } from '../dto/cars-make.dto';
import { PaginationOptions } from 'src/common/interface';

@Injectable()
export class CarsMakeService {
  constructor(private carsMakeRepository: CarsMakeRepository) {}

  async create(createCarsMakeDto: CreateCarsMakeDto) {
    try {
      return await this.carsMakeRepository.create({
        name: createCarsMakeDto.name,
        logo: createCarsMakeDto.logo,
        isActive: createCarsMakeDto.is_active,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(options?: PaginationOptions) {
    try {
      return await this.carsMakeRepository.findAll(options);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findMany() {
    try {
      return await this.carsMakeRepository.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const make = await this.carsMakeRepository.find(id);
      if (!make)
        throw new NotFoundException(`Car make with ID ${id} not found`);
      return make;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCarsMakeDto: UpdateCarsMakeDto) {
    try {
      const make = await this.carsMakeRepository.find(id);
      if (!make) {
        throw new NotFoundException(`Car make with ID ${id} not found`);
      }
      return await this.carsMakeRepository.update(id, {
        name: updateCarsMakeDto.name,
        logo: updateCarsMakeDto.logo,
        isActive: updateCarsMakeDto.is_active,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const make = await this.carsMakeRepository.find(id);
      if (!make)
        throw new NotFoundException(`Car make with ID ${id} not found`);

      return await this.carsMakeRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
