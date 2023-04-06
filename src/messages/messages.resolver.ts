import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { Message } from './models/messages.model';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { UseGuards } from '@nestjs/common';
import Session from '../common/middleware/session.decorator';
import { AuthGuard } from '../guards/auth.guard';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(private readonly messagesService: MessagesService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Message)
  createMessage(
    @Session() sessionUser: Session,
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
  ) {
    return this.messagesService.create(sessionUser, createMessageInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Message], { name: 'messages' })
  findOne(
    @Context('sessionUser') sessionUser: Session,
    @Args('conversationId', { type: () => String }) conversationId: string,
  ) {
    return this.messagesService.findAll(sessionUser, conversationId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Message)
  updateMessage(
    @Args('updateMessageInput') updateMessageInput: UpdateMessageInput,
  ) {
    return this.messagesService.update(
      updateMessageInput.id,
      updateMessageInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Message)
  removeMessage(@Args('id') id: string) {
    return this.messagesService.remove(id);
  }
}
