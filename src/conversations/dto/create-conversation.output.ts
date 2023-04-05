import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class CreateConversationOutput {
  @Field(() => String, { nullable: false })
  conversationId: string;
}
