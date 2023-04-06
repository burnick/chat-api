import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { PrismaService } from '../prisma.service';
import Session from '../common/middleware/session.decorator';
import { PubSubService } from '../pubsub.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import { conversationPopulated } from '../conversations/conversation-custom.resolvers';
import { User } from 'src/users/models/users.models';

@Injectable()
export class ConversationsService {
  constructor(
    private prisma: PrismaService,
    private pubSubService: PubSubService,
  ) {}

  async create(
    sessionUser: Session,
    createConversationInput: CreateConversationInput,
  ) {
    try {
      const { id: sessionId } = sessionUser.user;
      /**
       * create Conversation entity
       */
      const conversation = await this.prisma.conversation.create({
        data: {
          participants: {
            createMany: {
              data: createConversationInput.participantIds.map((id) => ({
                userId: id,
                hasSeenLatestMessage: id === sessionId,
              })),
            },
          },
        },
        include: conversationPopulated,
      });

      this.pubSubService.publish('CONVERSATION_CREATED', {
        conversationCreated: conversation,
      });

      return conversation.id;
    } catch (error) {
      console.log('createConversation error', error);
      throw new GraphQLError('Error creating conversation');
    }
  }

  findAll() {
    return `This action returns all conversations`;
  }

  async findMany(sessionUser: Session) {
    try {
      const { id } = sessionUser.user;

      const conversations = await this.prisma.conversation.findMany({
        /**
         * Below has been confirmed to be the correct
         * query by the Prisma team. Has been confirmed
         * that there is an issue on their end
         * Issue seems specific to Mongo
         */
        // where: {
        //   participants: {
        //     some: {
        //       userId: {
        //         equals: id,
        //       },
        //     },
        //   },
        // },
        include: conversationPopulated,
      });

      /**
       * Since above query does not work
       */
      return conversations.filter(
        (conversation) =>
          !!conversation.participants.find((p) => p.userId === id),
      );
    } catch (error: any) {
      throw new GraphQLError(error?.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: string, updateConversationInput: UpdateConversationInput) {
    return `This action updates a #${id} conversation`;
  }

  async remove(conversationId: string) {
    const conversation = await this.prisma.conversation.delete({
      where: {
        id: conversationId,
      },
    });

    this.pubSubService.publish('CONVERSATION_DELETED', {
      ...conversation,
    });

    return conversation;
  }
}
