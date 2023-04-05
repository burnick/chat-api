import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/models/users.models';
import { Conversation } from './conversations.models';

@ObjectType()
export class ConversationParticipant {
  @Field(() => String, { nullable: false })
  id: string;

  // @Field()
  // conversation: Conversation;

  @Field(() => User, { nullable: false })
  user: User;

  @Field({ nullable: false })
  userId: string;

  @Field({ nullable: false })
  conversationId: string;

  @Field({ nullable: false })
  hasSeenLatestMessage: boolean;
}
