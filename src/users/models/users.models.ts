import 'reflect-metadata';
import { ObjectType, Field } from '@nestjs/graphql';
// import { IsEmail } from 'class-validator';
import { BaseModel } from '../../common/models/base.models';

@ObjectType()
export class User extends BaseModel {
  @Field(() => String, { nullable: false })
  username: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  // @IsEmail()
  // @HideField()
  // email?: string;
}
