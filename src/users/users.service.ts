import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
  ) {}

  async findAll() {
    return this.userRepository.findAll();
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        `User with email ${dto.email} already exists`,
      );
    }

    const passwordHash = await argon2.hash(dto.password);
    return this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findById(id);

    if (dto.email) {
      const existingUser =
        await this.userRepository.findByEmail(dto.email);

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          `User with email ${dto.email} already exists`,
        );
      }
    }

    return this.userRepository.update(id, dto);
  }

  async delete(id: number) {
    await this.findById(id);

    return this.userRepository.delete(id);
  }
}