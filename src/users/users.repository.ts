import { Inject, Injectable } from '@nestjs/common';
import { DATABASE } from '../common/database/database.provider';
import type { Database } from '../common/database/database.provider';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async findAll() {
    return this.db.orm.public.User.all();
  }

  async findById(id: number) {
    return this.db.orm.public.User
      .where({
        id,
      })
      .first();
  }

  async findByEmail(email: string) {
    return this.db.orm.public.User
      .where({
        email,
      })
      .first();
  }

  async create(data: {
    email: string;
    passwordHash: string;
    role?: 'ADMIN' | 'HR' | 'EMPLOYEE';
  }) {
    return this.db.orm.public.User.create(data);
  }

  async update(
    id: number,
    data: {
      email?: string;
      passwordHash?: string;
      role?: 'ADMIN' | 'HR' | 'EMPLOYEE';
    },
  ) {
    return this.db.orm.public.User
      .where({
        id,
      })
      .update(data);
  }

  async delete(id: number) {
    return this.db.orm.public.User
      .where({
        id,
      })
      .delete();
  }
}