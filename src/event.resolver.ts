import { Resolver, Subscription, Args } from '@nestjs/graphql';
import { PubSubService } from './pubsub.service';
import { Conversation } from './conversations/models/conversations.models';
import { Message } from './messages/models/messages.model';
import { UpdateConversationOutput } from './conversations/dto/update-conversation.output';
@Resolver()
export class EventResolver {
  constructor(private pubSubService: PubSubService) {}

  @Subscription(() => Conversation, { name: 'conversationCreated' })
  conversationCreated() {
    return this.pubSubService.asyncIterator('CONVERSATION_CREATED');
  }

  @Subscription(() => Conversation, { name: 'conversationDeleted' })
  conversationDeleted() {
    return this.pubSubService.asyncIterator('CONVERSATION_DELETED');
  }

  @Subscription(() => UpdateConversationOutput, {
    name: 'conversationUpdated',
  })
  conversationUpdated() {
    return this.pubSubService.asyncIterator('CONVERSATION_UPDATED');
  }

  @Subscription(() => Message, {
    name: 'messageSent',
  })
  messageSent(@Args('conversationId') conversationId: string) {
    // console.log('message sent ', conversationId);
    return this.pubSubService
      .asyncIterator('MESSAGE_SENT')
      .next()
      .then(({ value }) =>
        value.filter((v: Conversation) => v.id === conversationId),
      );
  }
}
