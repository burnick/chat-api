import {
  Injectable,
  // BadRequestException,
  // ExecutionContext,
  // ConsoleLogger,
} from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { PrismaService } from '../prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
// import { User } from './models/users.models';
import Session from '../common/middleware/session.decorator';
// import { SearchUserInput } from './dto/search-user.input';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async createUsername(sessionUser: Session, createUserInput: CreateUserInput) {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          username: {
            contains: createUserInput.username,
            mode: 'insensitive',
          },
        },
      });
      if (existingUser) {
        console.log('existing User');
        throw new GraphQLError('Existing Username');
      }

      console.log('==== session id === ');
      console.log(sessionUser);

      return await this.prisma.user.update({
        where: {
          id: sessionUser.user.id,
        },
        data: {
          username: createUserInput.username,
        },
      });
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  }

  searchUsers({
    myUsername,
    searchedUsername,
  }: {
    myUsername: string;
    searchedUsername: string;
  }) {
    console.log('============ searchUsername');
    return this.prisma.user.findMany({
      where: {
        username: {
          contains: searchedUsername,
          not: myUsername,
          mode: 'insensitive',
        },
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({});
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  update(id: string, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
