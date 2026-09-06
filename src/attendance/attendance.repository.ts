import { Inject, Injectable } from '@nestjs/common';

import {
  DATABASE,
} from '../common/database/database.provider';

import type {
  Database,
} from '../common/database/database.provider';

@Injectable()
export class AttendanceRepository {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async findById(id: number) {
    return this.db.orm.public.AttendanceRecord
      .where({ id })
      .first();
  }

  async findByEmployeeAndDate(
    employeeId: number,
    attendanceDate: string,
  ) {
    return this.db.orm.public.AttendanceRecord
      .where({
        employeeId,
        attendanceDate,
      })
      .first();
  }

  async findByEmployeeId(
    employeeId: number,
  ) {
    return this.db.orm.public.AttendanceRecord
      .where({ employeeId })
      .all();
  }

  async findAll() {
    return this.db.orm.public.AttendanceRecord.all();
  }

  async create(data: {
    employeeId: number;
    attendanceDate: string;
    checkIn?: string;
    checkOut?: string;
  }) {
    return this.db.orm.public.AttendanceRecord.create(
      data,
    );
  }

  async update(
    id: number,
    data: {
      checkIn?: string;
      checkOut?: string;
    },
  ) {
    return this.db.orm.public.AttendanceRecord
      .where({ id })
      .update(data);
  }
}