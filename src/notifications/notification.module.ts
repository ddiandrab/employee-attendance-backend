import { Module } from '@nestjs/common';

import {
  DatabaseModule,
} from '../common/database/database.module';

import {
  UsersModule,
} from '../users/users.module';

import {
  NotificationController,
} from './notification.controller';

import {
  NotificationRepository,
} from './notification.repository';

import {
  NotificationService,
} from './notification.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],

  controllers: [
    NotificationController,
  ],

  providers: [
    NotificationRepository,
    NotificationService,
  ],

  exports: [
    NotificationService,
  ],
})
export class NotificationsModule {}