import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SearchUserInput {
  @Field({ nullable: false })
  searchUsername: string;
}
