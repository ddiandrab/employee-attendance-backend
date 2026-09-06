export class UpdateUserDto {
  email?: string;
  passwordHash?: string;
  role?: 'ADMIN' | 'HR' | 'EMPLOYEE';
}