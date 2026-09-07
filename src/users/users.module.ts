import { Module } from '@nestjs/common';
import { DatabaseModule } from '../common/database/database.module';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}