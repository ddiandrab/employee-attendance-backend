export class CreateEmployeeDto {
  employeeNumber: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  departmentId?: number;
  position?: string;
  joinDate?: string;
  userId: number;
}