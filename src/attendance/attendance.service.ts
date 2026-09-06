import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AttendanceRepository } from './attendance.repository';
import { EmployeesService } from '../employees/employees.service';


@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly employeesService: EmployeesService,
  ) {}

  async checkIn(userId: number) {
    const employee =
      await this.employeesService.findByUserId(
        userId,
      );

    if (!employee) {
      throw new NotFoundException(
        'Employee profile not found',
      );
    }

    const attendanceDate =
      this.getCurrentBusinessDate();

    const existingAttendance =
      await this.attendanceRepository
        .findByEmployeeAndDate(
          employee.id,
          attendanceDate,
        );

    if (existingAttendance) {
      throw new BadRequestException(
        'Employee has already checked in today',
      );
    }

    return this.attendanceRepository.create({
      employeeId: employee.id,
      attendanceDate,
      checkIn: new Date().toISOString(),
    });
  }

  async checkOut(userId: number) {
    const employee =
      await this.employeesService.findByUserId(
        userId,
      );

    if (!employee) {
      throw new NotFoundException(
        'Employee profile not found',
      );
    }

    const attendanceDate =
      this.getCurrentBusinessDate();

    const attendance =
      await this.attendanceRepository
        .findByEmployeeAndDate(
          employee.id,
          attendanceDate,
        );

    if (!attendance) {
      throw new BadRequestException(
        'Employee has not checked in today',
      );
    }

    if (attendance.checkOut) {
      throw new BadRequestException(
        'Employee has already checked out today',
      );
    }

    return this.attendanceRepository.update(
      attendance.id,
      {
        checkOut: new Date().toISOString(),
      },
    );
  }

  async findMyAttendance(userId: number) {
    const employee =
      await this.employeesService.findByUserId(
        userId,
      );

    if (!employee) {
      throw new NotFoundException(
        'Employee profile not found',
      );
    }

    return this.attendanceRepository
      .findByEmployeeId(employee.id);
  }

  async findAll() {
    return this.attendanceRepository.findAll();
  }

  private getCurrentBusinessDate(): string {
    return new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone: 'Asia/Jakarta',
      },
    ).format(new Date());
  }
}