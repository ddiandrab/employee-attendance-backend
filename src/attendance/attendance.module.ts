import { Module } from '@nestjs/common';

import { DatabaseModule } from '../common/database/database.module';
import { AuthModule } from '../auth/auth.module';
import { EmployeesModule } from '../employees/employees.module';

import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceRepository } from './attendance.repository';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    EmployeesModule,
  ],
  controllers: [
    AttendanceController,
  ],
  providers: [
    AttendanceService,
    AttendanceRepository,
  ],
})
export class AttendanceModule {}