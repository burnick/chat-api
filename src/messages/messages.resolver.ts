import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './models/messages.model';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import Session from '../common/middleware/session.decorator';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}
  @Mutation(() => Boolean, { name: 'sendMessage' })
  createMessage(
    @Context('sessionUser') sessionUser: Session,
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    return this.messagesService.create(sessionUser, createMessageInput);
  }

  @Query(() => [Message], { name: 'messages' })
  findOne(
    @Context('sessionUser') sessionUser: Session,
    @Args('conversationId', { type: () => String }) conversationId: string,
  ) {
    return this.messagesService.findAll(sessionUser, conversationId);
  }

  @Mutation(() => Message, { name: 'updateMessageInput' })
  updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ) {
    return this.messagesService.update(
      updateMessageInput.id,
      updateMessageInput,
    );
  }

  @Mutation(() => Message, { name: 'removeMessage' })
  removeMessage(@Args('id') id: string) {
    return this.messagesService.remove(id);
  }
}
