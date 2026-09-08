import { Injectable } from '@nestjs/common';
import { PubSubService } from './pubsub.service';
import { EmployeeProfileUpdatedEvent } from './events/employee-profile-updated-event';

@Injectable()
export class AuditPublisher {
  constructor(
    private readonly pubSubService: PubSubService,
  ) {}

  async publishEmployeeProfileUpdated(
    event: EmployeeProfileUpdatedEvent,
  ) {
    const topic = this.pubSubService.getTopic();

    const messageId =
      await topic.publishMessage({
        data: Buffer.from(
          JSON.stringify(event),
        ),
      });

    console.log(
      `Audit event published: ${messageId}`,
    );
  }
}
