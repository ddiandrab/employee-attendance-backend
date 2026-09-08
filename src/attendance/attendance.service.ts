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

  
  async findMyAttendance(
    userId: number,
    from?: string,
    to?: string,
  ) {
    const employee = await this.employeesService.findByUserId(userId);
    const dateRange = this.getDateRange(from, to);
    const records =
      await this.attendanceRepository
        .findByEmployeeId(employee.id);

    return records.filter(
      (record) =>
        record.attendanceDate >= dateRange.from &&
        record.attendanceDate <= dateRange.to,
    );
  }

  private getDateRange(
    from?: string,
    to?: string,
  ) {
    const today =
      new Intl.DateTimeFormat(
        'en-CA',
        {
          timeZone: 'Asia/Jakarta',
        },
      ).format(new Date());

    const defaultFrom =
      `${today.substring(0, 7)}-01`;

    return {
      from: from ?? defaultFrom,
      to: to ?? today,
    };
  }

  // async findMyAttendance(userId: number) {
  //   const employee =
  //     await this.employeesService.findByUserId(
  //       userId,
  //     );

  //   if (!employee) {
  //     throw new NotFoundException(
  //       'Employee profile not found',
  //     );
  //   }

  //   return this.attendanceRepository
  //     .findByEmployeeId(employee.id);
  // }

  async findAllAttendance(
  from?: string,
  to?: string,
) {
  const dateRange =
    this.getDateRange(from, to);

  const records =
    await this.attendanceRepository.findAll();

  const employees =
    await this.employeesService.findAll();

  const employeeMap = new Map(
    employees.map((employee) => [
      employee.id,
      employee,
    ]),
  );

  return records
    .filter(
      (record) =>
        record.attendanceDate >=
          dateRange.from &&
        record.attendanceDate <=
          dateRange.to,
    )
    .map((record) => {
      const employee =
        employeeMap.get(
          record.employeeId,
        );

      return {
        id: record.id,
        employeeId: record.employeeId,
        employeeNumber:
          employee?.employeeNumber ?? '-',
        employeeName: employee
          ? [
              employee.firstName,
              employee.lastName,
            ]
              .filter(Boolean)
              .join(' ')
          : '-',
        departmentId:
          employee?.departmentId ?? null,
        position:
          employee?.position ?? null,
        attendanceDate:
          record.attendanceDate,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
      };
    })
    .sort(
      (a, b) =>
        b.attendanceDate.localeCompare(
          a.attendanceDate,
        ),
    );
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