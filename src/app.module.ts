import { Module } from '@nestjs/common';
import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { NotificationsModule } from './notifications/notification.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    AuthModule, 
    EmployeesModule, 
    UsersModule, 
    DepartmentsModule, 
    AttendanceModule, 
    NotificationsModule,
    AuditModule
  ],
})
export class AppModule {}
