import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { auditDb } from './audit.database';

@Injectable()
export class AuditRepository implements OnModuleInit
{
  async onModuleInit() {
    await auditDb.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGSERIAL PRIMARY KEY,
        event_id UUID NOT NULL UNIQUE,
        event_type VARCHAR(100) NOT NULL,
        user_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        payload JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  async create(data: {
    eventId: string;
    eventType: string;
    userId: number;
    employeeId: number;
    payload: object;
  }) {
    await auditDb.query(
      `
        INSERT INTO audit_logs (
          event_id,
          event_type,
          user_id,
          employee_id,
          payload
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (event_id)
        DO NOTHING
      `,
      [
        data.eventId,
        data.eventType,
        data.userId,
        data.employeeId,
        JSON.stringify(data.payload),
      ],
    );
  }
}
