import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { AttendanceService } from './attendance.service';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService:
      AttendanceService,
  ) {}

  @Post('check-in')
  @Roles('EMPLOYEE', 'HR', 'ADMIN')
  async checkIn(@Req() request: any) {
    return this.attendanceService.checkIn(
      request.user.userId,
    );
  }

  @Post('check-out')
  @Roles('EMPLOYEE', 'HR', 'ADMIN')
  async checkOut(@Req() request: any) {
    return this.attendanceService.checkOut(
      request.user.userId,
    );
  }

  @Get('me')
  @Roles('EMPLOYEE', 'HR', 'ADMIN')
  async findMyAttendance(
    @Req() request: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.findMyAttendance(
      request.user.userId,
      from,
      to,
    );
  }

  @Get()
  @Roles('ADMIN', 'HR')
  async findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService
      .findAllAttendance(from, to);
  }
}