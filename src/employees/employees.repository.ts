import { Inject, Injectable } from '@nestjs/common';

import { DATABASE } from '../common/database/database.provider';
import type { Database } from '../common/database/database.provider';

@Injectable()
export class EmployeesRepository {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async findAll() {
    return this.db.orm.public.Employee.all();
  }

  async findById(id: number) {
    return this.db.orm.public.Employee
      .where({
        id,
      })
      .first();
  }

  async findByEmployeeNumber(employeeNumber: string) {
    return this.db.orm.public.Employee
      .where({
        employeeNumber,
      })
      .first();
  }

  async findByUserId(userId: number) {
    return this.db.orm.public.Employee
      .where({
        userId,
      })
      .first();
  }

  async create(data: {
    employeeNumber: string;
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    photoUrl?: string;
    departmentId?: number;
    position?: string;
    joinDate?: string;
    userId: number;
  }) {
    return this.db.orm.public.Employee.create(data);
  }

  async update(
    id: number,
    data: {
      employeeNumber?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      photoUrl?: string;
      departmentId?: number;
      position?: string;
      joinDate?: string;
      isActive?: boolean;
    },
  ) {
    return this.db.orm.public.Employee
      .where({
        id,
      })
      .update(data);
  }

  async delete(id: number) {
    return this.db.orm.public.Employee
      .where({
        id,
      })
      .delete();
  }
}