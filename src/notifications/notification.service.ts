import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  UsersService,
} from '../users/users.service';

import {
  NotificationRepository,
} from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository:
      NotificationRepository,

    private readonly userService:
      UsersService,
  ) {}

  async findMine(userId: number) {
    const notifications =
      await this.notificationRepository
        .findByRecipientId(userId);

    return notifications.sort(
      (a, b) =>
        b.createdAt.localeCompare(
          a.createdAt,
        ),
    );
  }

  async markAsRead(
    userId: number,
    notificationId: number,
  ) {
    const notification =
      await this.notificationRepository
        .findById(notificationId);

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    if (
      notification.recipientId !== userId
    ) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    return this.notificationRepository
      .markAsRead(notificationId);
  }

  async markAllAsRead(userId: number) {
    return this.notificationRepository
      .markAllAsRead(userId);
  }

  async notifyEmployeeProfileUpdated(
    employeeName: string,
  ) {
    const users =
      await this.userService.findByRoles([
        'ADMIN',
        'HR',
      ]);

    for (const user of users) {
      await this.notificationRepository
        .create({
          recipientId: user.id,
          type:
            'EMPLOYEE_PROFILE_UPDATED',
          title:
            'Employee Profile Updated',
          message:
            `${employeeName} updated their profile information.`,
        });
    }
  }
}