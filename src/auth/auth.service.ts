import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from '../users/dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ) {
    const user =
      await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const passwordValid = await argon2.verify(
      user.passwordHash,
      password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken =
      await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

async changePassword(userId: number,dto: ChangePasswordDto) {
    const user =
      await this.userService.findById(userId);


    if (!user) {
      throw new NotFoundException(
        `User with id ${userId} not found`,
      );
    }

    const currentPasswordValid =
      await argon2.verify(
        user.passwordHash,
        dto.currentPassword,
      );

    if (!currentPasswordValid) {
      throw new UnauthorizedException(
        'Current password is incorrect',
      );
    }

    const newPasswordHash =
      await argon2.hash(dto.newPassword);

      return this.userService.updatePassword(
        userId,
        newPasswordHash,
    );
  }
}