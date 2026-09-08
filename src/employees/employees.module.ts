import { Module } from '@nestjs/common';

import { DatabaseModule } from '../common/database/database.module';
import { AuthModule } from '../auth/auth.module';

import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';
import { NotificationsModule } from '../notifications/notification.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    NotificationsModule
  ],
  controllers: [
    EmployeesController
  ],
  providers: [
    EmployeesRepository,
    EmployeesService,
  ],
  exports: [
    EmployeesService,
  ],
})
export class EmployeesModule {}