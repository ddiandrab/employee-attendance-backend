import { Module } from '@nestjs/common';
import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [AuthModule, EmployeesModule, UsersModule, DepartmentsModule, AttendanceModule],
})
export class AppModule {}
