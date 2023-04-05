import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.models';
import { ConversationParticipant } from './conversationParticipant.models';
import { Message } from 'src/messages/models/messages.model';

@ObjectType()
export class Conversation extends BaseModel {
  @Field(() => [ConversationParticipant], { nullable: true })
  participants: ConversationParticipant[];

  @Field(() => Message, { nullable: true })
  latestMessage: Message;

  @Field(() => String, { nullable: true })
  latestMessageId: string;
}
