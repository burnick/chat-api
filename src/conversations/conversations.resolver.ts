import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ConversationsService } from './conversations.service';
import { Conversation } from './models/conversations.models';
import Session from '../common/middleware/session.decorator';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import { CreateConversationOutput } from './dto/create-conversation.output';
import { UpdateConversationOutput } from './dto/update-conversation.output';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { MarkConversationReadInput } from './dto/mark-conversation-read.input';

@Resolver(() => Conversation)
export class ConversationsResolver {
  constructor(private readonly conversationsService: ConversationsService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CreateConversationOutput)
  createConversation(
    @Context('sessionUser') sessionUser: Session,
    @Args('createConversationInput')
    createConversationInput: CreateConversationInput,
  ) {
    const id = this.conversationsService.create(
      sessionUser,
      createConversationInput,
    );

    return { conversationId: id };
  }

  @UseGuards(AuthGuard)
  @Query(() => [Conversation], { name: 'conversations' })
  findAll(@Context('sessionUser') sessionUser: Session) {
    return this.conversationsService.getConversations(sessionUser);
  }

  @UseGuards(AuthGuard)
  @Query(() => Conversation, { name: 'conversation' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.conversationsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => UpdateConversationOutput, { name: 'updateConversation' })
  updateConversation(
    @Args('updateConversationInput')
    updateConversationInput: UpdateConversationInput,
  ) {
    return this.conversationsService.update(
      updateConversationInput.id,
      updateConversationInput,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { name: 'deleteConversation' })
  deleteConversation(
    @Context('sessionUser') sessionUser: Session,
    @Args('conversationId') conversationId: string,
  ) {
    return this.conversationsService.remove(sessionUser, conversationId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean, { name: 'markConversationAsRead' })
  markConversationAsRead(
    @Context('sessionUser') sessionUser: Session,
    @Args('markConversationReadInput')
    markConversationReadInput: MarkConversationReadInput,
  ) {
    return this.conversationsService.updateMany(
      sessionUser,
      markConversationReadInput,
    );
  }
}
