import { Injectable } from '@nestjs/common';
import { AuditRepository } from './audit.repository';
import { EmployeeProfileUpdatedEvent } from './events/employee-profile-updated-event';

@Injectable()
export class AuditService {
  constructor(
    private readonly auditRepository:
      AuditRepository,
  ) {}

  async logEmployeeProfileUpdated(
    event: EmployeeProfileUpdatedEvent,
  ) {
    await this.auditRepository.create({
      eventId: event.eventId,
      eventType: event.eventType,
      userId: event.userId,
      employeeId: event.employeeId,
      payload: event,
    });
  }
}
