import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class MarkConversationReadInput {
  @Field(() => String, { nullable: false })
  userId: string;
  @Field(() => String, { nullable: false })
  conversationId: string;
}
