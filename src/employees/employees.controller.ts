import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeesController {
  constructor(
    private readonly employeeService: EmployeesService,
  ) {}

  @Get()
  @Roles('ADMIN', 'HR')
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get('me')
  @Roles('EMPLOYEE', 'HR', 'ADMIN')
  async findMe(@Req() request: any) {
    return this.employeeService.findByUserId(
      request.user.userId,
    );
  }

  @Patch('me')
  @Roles('EMPLOYEE', 'HR', 'ADMIN')
  async updateMyProfile(
    @Req() request: any,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.employeeService.updateMyProfile(
      request.user.userId,
      dto,
    );
  }

  @Post()
  @Roles('ADMIN', 'HR')
  async create(
    @Body() dto: CreateEmployeeDto,
  ) {
    return this.employeeService.create(dto);
  }

  @Get(':id')
  @Roles('ADMIN', 'HR')
  async findById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.employeeService.findById(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'HR')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.employeeService.delete(id);
  }
}