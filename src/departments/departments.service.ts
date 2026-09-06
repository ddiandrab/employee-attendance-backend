import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsRepository } from './departments.repository';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentRepository: DepartmentsRepository,
  ) {}

  async findAll() {
    return this.departmentRepository.findAll();
  }

  async findById(id: number) {
    const department =
      await this.departmentRepository.findById(id);

    if (!department) {
      throw new NotFoundException(
        `Department with id ${id} not found`,
      );
    }

    return department;
  }

  async create(dto: CreateDepartmentDto) {
    const existingDepartment =
      await this.departmentRepository.findByName(dto.name);

    if (existingDepartment) {
      throw new ConflictException(
        `Department ${dto.name} already exists`,
      );
    }

    return this.departmentRepository.create(dto);
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
  ) {
    await this.findById(id);

    if (dto.name) {
      const existingDepartment =
        await this.departmentRepository.findByName(dto.name);

      if (
        existingDepartment &&
        existingDepartment.id !== id
      ) {
        throw new ConflictException(
          `Department ${dto.name} already exists`,
        );
      }
    }

    return this.departmentRepository.update(id, dto);
  }

  async delete(id: number) {
    await this.findById(id);

    return this.departmentRepository.delete(id);
  }
}