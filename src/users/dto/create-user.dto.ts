export class CreateUserDto {
  email: string;
  password: string;
  role?: 'ADMIN' | 'HR' | 'EMPLOYEE';
}