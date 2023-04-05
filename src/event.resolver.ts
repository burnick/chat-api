import { Int, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubService } from './pubsub.service';
import { Conversation } from './conversations/models/conversations.models';
import { Message } from './messages/models/messages.model';
@Resolver()
export class EventResolver {
  constructor(private pubSubService: PubSubService) {}

  @Subscription(() => Conversation, { name: 'conversationCreated' })
  conversationCreated() {
    return this.pubSubService.asyncIterator('CONVERSATION_CREATED');
  }

  @Subscription(() => String, { name: 'conversationDeleted' })
  conversationDeleted() {
    return this.pubSubService.asyncIterator('CONVERSATION_DELETED');
  }

  @Subscription(() => String, { name: 'conversationUpdated' })
  conversationUpdated() {
    return this.pubSubService.asyncIterator('CONVERSATION_UPDATED');
  }

  @Subscription(() => Message, { name: 'messageSent' })
  messageSent() {
    return this.pubSubService.asyncIterator('MESSAGE_SENT');
  }
}
