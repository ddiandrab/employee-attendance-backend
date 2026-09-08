import { Module } from '@nestjs/common';

import { AuditRepository } from './audit.repository';
import { AuditService } from './audit.service';
import { AuditPublisher } from './audit.publisher';
import { PubSubService } from './pubsub.service';
import { AuditConsumer } from './audit.consumer';

@Module({
  providers: [
    AuditRepository,
    AuditService,
    AuditPublisher, 
    AuditConsumer,
    PubSubService,
  ],
  exports: [
    AuditService,
    AuditPublisher,
  ],
})
export class AuditModule {}
