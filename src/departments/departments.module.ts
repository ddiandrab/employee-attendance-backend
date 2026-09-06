import { Module } from '@nestjs/common';

import { DatabaseModule } from '../common/database/database.module';
import { DepartmentsController } from './departments.controller';
import { DepartmentsRepository } from './departments.repository';
import { DepartmentsService } from './departments.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DepartmentsController],
  providers: [
    DepartmentsRepository,
    DepartmentsService,
  ],
})
export class DepartmentsModule {}