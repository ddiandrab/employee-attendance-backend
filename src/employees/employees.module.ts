import { Module } from '@nestjs/common';

import { DatabaseModule } from '../common/database/database.module';
import { AuthModule } from '../auth/auth.module';

import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';

@Module({
  imports: [
    DatabaseModule,
    AuthModule
  ],
  controllers: [EmployeesController],
  providers: [
    EmployeesRepository,
    EmployeesService,
  ],
})
export class EmployeesModule {}