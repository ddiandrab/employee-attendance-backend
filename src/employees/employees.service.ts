import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesRepository } from './employees.repository';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { NotificationService } from '../notifications/notification.service';
import { AuditPublisher } from '../audit/audit.publisher';


@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeeRepository: EmployeesRepository,
    private readonly notificationService: NotificationService,
    private readonly auditPublisher: AuditPublisher,
  ) {}

  async findAll() {
    return this.employeeRepository.findAll();
  }

  async findById(id: number) {
    const employee =
      await this.employeeRepository.findById(id);

    if (!employee) {
      throw new NotFoundException(
        `Employee with id ${id} not found`,
      );
    }

    return employee;
  }

  async findByUserId(userId: number) {
  const employee =
    await this.employeeRepository
      .findByUserId(userId);

  if (!employee) {
    throw new NotFoundException(
      `Employee for user ${userId} not found`,
    );
  }

  return employee;
  }

  async create(dto: CreateEmployeeDto) {
    const existingEmployee =
      await this.employeeRepository.findByEmployeeNumber(
        dto.employeeNumber,
      );

    if (existingEmployee) {
      throw new ConflictException(
        `Employee number ${dto.employeeNumber} already exists`,
      );
    }

    const existingUser =
      await this.employeeRepository.findByUserId(dto.userId);

    if (existingUser) {
      throw new ConflictException(
        `User ${dto.userId} already has an employee profile`,
      );
    }

    return this.employeeRepository.create(dto);
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
  ) {
    await this.findById(id);

    if (dto.employeeNumber) {
      const existingEmployee =
        await this.employeeRepository.findByEmployeeNumber(
          dto.employeeNumber,
        );

      if (
        existingEmployee &&
        existingEmployee.id !== id
      ) {
        throw new ConflictException(
          `Employee number ${dto.employeeNumber} already exists`,
        );
      }
    }

    return this.employeeRepository.update(id, dto);
  }

  async updateMyProfile(userId: number, dto: UpdateMyProfileDto,
  ) {
    const employee = await this.findByUserId(userId);
    const changedFields: string[] = []; 

    if ( dto.phone !== undefined && dto.phone !== employee.phone ) { 
      changedFields.push('phone'); 
    } 
    
    if ( dto.photoUrl !== undefined && dto.photoUrl !== employee.photoUrl ) { 
      changedFields.push('photoUrl'); 
    }

    const updated =
        await this.employeeRepository.update(
          employee.id,
          {
            phone: dto.phone,
            photoUrl: dto.photoUrl,
          },
        );

      const employeeName = [
        employee.firstName,
        employee.lastName,
      ]
        .filter(Boolean)
        .join(' ');

      // Notify admin about the profile update
      await this.notificationService
        .notifyEmployeeProfileUpdated(
          employeeName,
        );

      // Audit event for profile update
      if (changedFields.length > 0) { 
        await this.auditPublisher.publishEmployeeProfileUpdated({ 
          eventId: crypto.randomUUID(), 
          eventType: 'EMPLOYEE_PROFILE_UPDATED', 
          employeeId: employee.id, 
          userId: userId, 
          changedFields: changedFields, 
          timestamp: new Date().toISOString(), 
        }); 
      }

      return updated;
  }

  async delete(id: number) {
    await this.findById(id);

    return this.employeeRepository.delete(id);
  }
}