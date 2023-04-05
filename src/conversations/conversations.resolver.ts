import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';
import { Conversation } from './models/conversations.models';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import Session from '../common/middleware/session.decorator';
import { User } from '../users/models/users.models';

@Resolver(() => Conversation)
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Mutation(() => Conversation)
  createConversation(
    @Session() sessionUser: User,
    @Args('createConversationInput')
    createConversationInput: CreateConversationInput,
  ) {
    const id = this.conversationsService.create(
      sessionUser,
      createConversationInput,
    );

    return { conversationId: id };
  }

  @Query(() => [Conversation], { name: 'conversations' })
  findAll(@Context('sessionUser') sessionUser: Session) {
    return this.conversationsService.findMany(sessionUser);
  }

  @Query(() => Conversation, { name: 'conversation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.conversationsService.findOne(id);
  }

  @Mutation(() => Conversation)
  updateConversation(
    @Args('updateConversationInput')
    updateConversationInput: UpdateConversationInput,
  ) {
    return this.conversationsService.update(
      updateConversationInput.id,
      updateConversationInput,
    );
  }

  @Mutation(() => Conversation)
  removeConversation(@Args('id', { type: () => Int }) id: number) {
    return this.conversationsService.remove(id);
  }
}
