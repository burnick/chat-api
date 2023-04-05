import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  private pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  publish<T>(topic: string, payload: T) {
    return this.pubSub.publish(topic, payload);
  }

  async subscribe<T>(
    topic: string,
    callback: (payload: T) => void,
  ): Promise<number> {
    return await this.pubSub.subscribe(topic, callback);
  }

  async unsubscribe(subId: number): Promise<void> {
    return await this.pubSub.unsubscribe(subId);
  }

  asyncIterator(topic: string) {
    return this.pubSub.asyncIterator(topic);
  }
}
