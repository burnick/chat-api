import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateConversationInput {
  @Field(() => [String], { nullable: true })
  participantIds: string[];
}
