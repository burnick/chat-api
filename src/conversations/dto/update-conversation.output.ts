import { Field, ObjectType } from '@nestjs/graphql';
import { Message } from 'src/messages/models/messages.model';
import { Conversation } from '../models/conversations.models';

@ObjectType()
export class UpdateConversationOutput {
  @Field(() => Conversation)
  conversation: Conversation;

  @Field(() => Date, { nullable: false })
  updatedAt: Date;

  @Field(() => Message, { nullable: true })
  latestMessage: Message;

  @Field(() => [String], { nullable: true })
  addedUserIds: string[];

  @Field(() => [String], { nullable: true })
  removedUserIds: string[];
}
