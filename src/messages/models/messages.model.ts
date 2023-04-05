import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
import { BaseModel } from '../../common/models/base.models';
import { User } from 'src/users/models/users.models';

@ObjectType()
export class Message extends BaseModel {
  @Field(() => String, { nullable: false })
  senderId: string;

  @Field(() => String, { nullable: false })
  conversationId: string;

  @Field(() => String, { nullable: false })
  body: string;

  @Field(() => User, { nullable: false })
  sender: User;
}
