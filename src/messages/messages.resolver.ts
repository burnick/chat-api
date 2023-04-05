import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './models/messages.model';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import Session from '../common/middleware/session.decorator';
import { User } from '../users/models/users.models';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @Mutation(() => Message)
  createMessage(
    @Session() sessionUser: User,
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    return this.messagesService.create(sessionUser, createMessageInput);
  }

  // @Query(() => [Message], { name: 'messages' })
  // findAll() {
  //   return this.messagesService.findAll();
  // }

  @Query(() => [Message], { name: 'messages' })
  findOne(
    @Args('conversationId', { type: () => String }) conversationId: string,
  ) {
    return this.messagesService.findAll(conversationId);
  }

  @Mutation(() => Message)
  updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ) {
    return this.messagesService.update(
      updateMessageInput.id,
      updateMessageInput,
    );
  }

  @Mutation(() => Message)
  removeMessage(@Args('id', { type: () => Int }) id: number) {
    return this.messagesService.remove(id);
  }
}
