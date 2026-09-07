import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from '../users/dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.login(
      body.email,
      body.password,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() request: any) {
    return request.user;
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() request: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      request.user.userId,
      dto,
    );
  }
}