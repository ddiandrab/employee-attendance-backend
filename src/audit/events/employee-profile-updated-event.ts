export const EMPLOYEE_PROFILE_UPDATED = 'EMPLOYEE_PROFILE_UPDATED';

export interface EmployeeProfileUpdatedEvent {
  eventId: string;
  eventType: typeof EMPLOYEE_PROFILE_UPDATED;
  employeeId: number;
  userId: number;
  changedFields: string[];
  timestamp: string;
}
