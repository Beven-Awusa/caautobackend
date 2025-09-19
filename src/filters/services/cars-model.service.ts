import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CarsModelRepository } from '../repositories/cars-model.repository';
import { CreateCarsModelDto } from '../dto/cars-model.dto';
import { UpdateCarsModelDto } from '../dto/cars-model.dto';
import { CarsMakeRepository } from '../repositories';

@Injectable()
export class CarsModelService {
  constructor(
    private carsModelRepository: CarsModelRepository,
    private carsMakeRepository: CarsMakeRepository,
  ) {}

  async create(createCarsModelDto: CreateCarsModelDto) {
    try {
      const model = await this.carsModelRepository.findByName(
        createCarsModelDto.name,
      );
      if (model)
        throw new NotFoundException(
          `Car model with ${createCarsModelDto.name} already exists`,
        );

      const make = await this.carsMakeRepository.find(
        createCarsModelDto.make_id,
      );
      if (!make)
        throw new NotFoundException(
          `Car make with ID ${createCarsModelDto.make_id} not found`,
        );
      return await this.carsModelRepository.create({
        make: { connect: { id: createCarsModelDto.make_id } },
        name: createCarsModelDto.name,
        yearStart: createCarsModelDto.year_start,
        yearEnd: createCarsModelDto.year_end,
        isActive: createCarsModelDto.is_active,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.carsModelRepository.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByName(name: string) {
    try {
      const model = await this.carsModelRepository.findByName(name);
      if (!model)
        throw new NotFoundException(`Car model with name ${name} not found`);
      return model;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findManyByMakeId(makeId: string) {
    try {
      const make = await this.carsMakeRepository.find(makeId);
      if (!make)
        throw new NotFoundException(`Car make with ID ${makeId} not found`);
      return await this.carsModelRepository.findManyByMakeId(makeId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const model = await this.carsModelRepository.find(id);
      if (!model)
        throw new NotFoundException(`Car model with ID ${id} not found`);
      return model;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, updateCarsModelDto: UpdateCarsModelDto) {
    try {
      const model = await this.carsModelRepository.find(id);
      if (!model)
        throw new NotFoundException(`Car model with ID ${id} not found`);

      return await this.carsModelRepository.update(id, updateCarsModelDto);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      const model = await this.carsModelRepository.find(id);
      if (!model)
        throw new NotFoundException(`Car model with ID ${id} not found`);

      return await this.carsModelRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
