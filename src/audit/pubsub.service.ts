import {
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import {
  PubSub,
  Topic,
  Subscription,
} from '@google-cloud/pubsub';

@Injectable()
export class PubSubService
  implements OnModuleInit
{
  private readonly pubSub: PubSub;

  private readonly topicName =
    process.env.PUBSUB_TOPIC ??
    'employee-events';

  private readonly subscriptionName =
    process.env.PUBSUB_SUBSCRIPTION ??
    'employee-audit-log';

  constructor() {
    this.pubSub = new PubSub({
      projectId:
        process.env.PUBSUB_PROJECT_ID ??
        'employee-attendance-local',
    });
  }

  async onModuleInit() {
    await this.createTopicIfNotExists();
    await this.createSubscriptionIfNotExists();
  }

  private async createTopicIfNotExists() {
    const [exists] =
      await this.pubSub
        .topic(this.topicName)
        .exists();

    if (!exists) {
      await this.pubSub.createTopic(
        this.topicName,
      );

      console.log(
        `Pub/Sub topic created: ${this.topicName}`,
      );
    }
  }

  private async createSubscriptionIfNotExists() {
    const topic =
      this.pubSub.topic(
        this.topicName,
      );

    const subscription =
      topic.subscription(
        this.subscriptionName,
      );

    const [exists] =
      await subscription.exists();

    if (!exists) {
      await topic.createSubscription(
        this.subscriptionName,
      );

      console.log(
        `Pub/Sub subscription created: ${this.subscriptionName}`,
      );
    }
  }

  getTopic(): Topic {
    return this.pubSub.topic(
      this.topicName,
    );
  }

  getSubscription(): Subscription {
    return this.pubSub
      .topic(this.topicName)
      .subscription(
        this.subscriptionName,
      );
  }
}
