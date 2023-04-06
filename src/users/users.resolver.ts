import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/users.models';
import Session from '../common/middleware/session.decorator';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  createUsername(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Context('sessionUser') sessionUser: Session,
  ) {
    console.log('sessionUser', sessionUser);
    return this.usersService.createUsername(sessionUser, createUserInput);
  }

  @Query(() => [User], { name: 'findAllUsers' })
  findAll() {
    return this.usersService.findAll();
  }

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

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }
}
