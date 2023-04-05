import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field({ nullable: false })
  messageId: string;

  @Field({ nullable: false })
  senderId: string;

  @Field({ nullable: false })
  conversationId: string;

  @Field({ nullable: false })
  body: string;
}
