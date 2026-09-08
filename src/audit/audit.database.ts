import 'dotenv/config';

import { Pool } from 'pg';

export const auditDb = new Pool({
  connectionString:
    process.env.AUDIT_DATABASE_URL,
});
