import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMessageInput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  senderId: string;

  @Field({ nullable: false })
  conversationId: string;

  @Field({ nullable: false })
  body: string;
}
