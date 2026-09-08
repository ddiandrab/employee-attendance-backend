import { Inject, Injectable } from '@nestjs/common';

import {
  DATABASE,
} from '../common/database/database.provider';

import type {
  Database,
} from '../common/database/database.provider';

@Injectable()
export class NotificationRepository {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async findByRecipientId(
    recipientId: number,
  ) {
    return this.db.orm.public.Notification
      .where({
        recipientId,
      })
      .all();
  }

  async findById(id: number) {
    return this.db.orm.public.Notification
      .where({ id })
      .first();
  }

  async create(data: {
    recipientId: number;
    type: 'EMPLOYEE_PROFILE_UPDATED';
    title: string;
    message: string;
  }) {
    return this.db.orm.public.Notification
      .create(data);
  }

  async markAsRead(id: number) {
    return this.db.orm.public.Notification
      .where({ id })
      .update({
        isRead: true,
      });
  }

  async markAllAsRead(
    recipientId: number,
  ) {
    const notifications =
      await this.findByRecipientId(
        recipientId,
      );

    for (const notification of notifications) {
      if (!notification.isRead) {
        await this.markAsRead(
          notification.id,
        );
      }
    }

    return true;
  }
}