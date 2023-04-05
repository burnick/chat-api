import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/users.models';
import { UseGuards } from '@nestjs/common';
import Session from '../common/middleware/session.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  createUsername(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Context('sessionUser') sessionUser: Session,
  ) {
    console.log('sessionUser', sessionUser);
    return this.usersService.createUsername(sessionUser, createUserInput);
  }

  @UseGuards(AuthGuard)
  @Query(() => [User], { name: 'findAllUsers' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => [User], { name: 'searchUsers' })
  searchUsers(
    @Context('sessionUser') sessionUser: Session,
    @Args('username', { type: () => String }) username: string,
  ) {
    return this.usersService.searchUsers({
      myUsername: sessionUser.user.username,
      searchedUsername: username,
    });
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }
}
