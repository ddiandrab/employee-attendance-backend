import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';

import {
  Message,
} from '@google-cloud/pubsub';

import { PubSubService } from './pubsub.service';
import { AuditService } from './audit.service';

@Injectable()
export class AuditConsumer implements OnModuleInit, OnModuleDestroy
{
  private messageHandler?: (
    message: Message,
  ) => void;

  constructor(
    private readonly pubSubService: PubSubService,
    private readonly auditService: AuditService,
  ) {}

  async onModuleInit() {
    const subscription = this.pubSubService.getSubscription();

    this.messageHandler =
      async (message: Message) => {
        try {
          const event =
            JSON.parse(
              message.data.toString(),
            );

          console.log(
            'Audit event received:',
            event,
          );

          await this.auditService
            .logEmployeeProfileUpdated(
              event,
            );

          message.ack();
        } catch (error) {
          console.error(
            'Failed to process audit event:',
            error,
          );

          message.nack();
        }
      };

    subscription.on(
      'message',
      this.messageHandler,
    );

    subscription.on(
      'error',
      (error) => {
        console.error(
          'Pub/Sub subscription error:',
          error,
        );
      },
    );

    console.log(
      'Audit consumer started',
    );
  }

  async onModuleDestroy() {
    const subscription =
      this.pubSubService
        .getSubscription();

    if (this.messageHandler) {
      subscription.removeListener(
        'message',
        this.messageHandler,
      );
    }

    await subscription.close();
  }
}
