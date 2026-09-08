import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

import {
  RolesGuard,
} from '../auth/guards/roles.guard';

import {
  NotificationService,
} from './notification.service';

@Controller('notifications')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class NotificationController {
  constructor(
    private readonly notificationService:
      NotificationService,
  ) {}

  @Get()
  async findMine(
    @Req() request: any,
  ) {
    return this.notificationService
      .findMine(
        request.user.userId,
      );
  }

  @Patch(':id/read')
  async markAsRead(
    @Req() request: any,
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.notificationService
      .markAsRead(
        request.user.userId,
        id,
      );
  }

  @Patch('read-all')
  async markAllAsRead(
    @Req() request: any,
  ) {
    return this.notificationService
      .markAllAsRead(
        request.user.userId,
      );
  }
}