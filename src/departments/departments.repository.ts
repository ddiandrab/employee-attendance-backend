import { Inject, Injectable } from '@nestjs/common';

import { DATABASE } from '../common/database/database.provider';
import type { Database } from '../common/database/database.provider';

@Injectable()
export class DepartmentsRepository {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async findAll() {
    return this.db.orm.public.Department.all();
  }

  async findById(id: number) {
    return this.db.orm.public.Department
      .where({
        id,
      })
      .first();
  }

  async findByName(name: string) {
    return this.db.orm.public.Department
      .where({
        name,
      })
      .first();
  }

  async create(data: {
    name: string;
    description?: string;
  }) {
    return this.db.orm.public.Department.create(data);
  }

  async update(
    id: number,
    data: {
      name?: string;
      description?: string;
    },
  ) {
    return this.db.orm.public.Department
      .where({
        id,
      })
      .update(data);
  }

  async delete(id: number) {
    return this.db.orm.public.Department
      .where({
        id,
      })
      .delete();
  }
}