import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { PrismaService } from '../prisma.service';
import Session from '../common/middleware/session.decorator';
import { PubSubService } from '../pubsub.service';
import { CreateConversationInput } from './dto/create-conversation.input';
import { UpdateConversationInput } from './dto/update-conversation.input';
import { conversationPopulated } from '../conversations/conversation-custom.resolvers';
import { ConversationPopulated } from '../common/types';
import { MarkConversationReadInput } from './dto/mark-conversation-read.input';

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
    if (!sessionUser?.user) {
      throw new GraphQLError('Not authorized');
    }
    const { id: userId } = sessionUser.user;

    try {
      const conversation = await this.prisma.conversation.create({
        data: {
          participants: {
            createMany: {
              data: createConversationInput.participantIds.map((id) => ({
                userId: id,
                hasSeenLatestMessage: id === userId,
              })),
            },
          },
        },
        include: conversationPopulated,
      });
      this.pubSubService.publish('CONVERSATION_CREATED', {
        conversationCreated: conversation,
      });

      return { conversationId: conversation.id };
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

  async remove(sessionUser: Session, conversationId: string) {
    if (!sessionUser?.user) {
      throw new GraphQLError('Not authorized');
    }

    try {
      const [deletedConversation] = await this.prisma.$transaction([
        this.prisma.conversation.delete({
          where: {
            id: conversationId,
          },
          include: conversationPopulated,
        }),
        this.prisma.conversationParticipant.deleteMany({
          where: {
            conversationId,
          },
        }),
        this.prisma.message.deleteMany({
          where: {
            conversationId,
          },
        }),
      ]);

      this.pubSubService.publish('CONVERSATION_DELETED', {
        conversationDeleted: deletedConversation,
      });
      return true;
    } catch (error: any) {
      console.log('deleteConversation error', error);
      throw new GraphQLError(error?.message);
    }
  }

  async getConversations(
    sessionUser: Session,
  ): Promise<ConversationPopulated[]> {
    if (!sessionUser?.user) {
      throw new GraphQLError('Not authorized');
    }

    try {
      const { id } = sessionUser.user;
      /**
       * Find all conversations that user is part of
       */
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
      console.log('error', error);
      throw new GraphQLError(error?.message);
    }
  }

  async updateMany(
    sessionUser: Session,
    markConversationReadInput: MarkConversationReadInput,
  ) {
    if (!sessionUser?.user) {
      throw new GraphQLError('Not authorized');
    }
    try {
      await this.prisma.conversationParticipant.updateMany({
        where: {
          ...markConversationReadInput,
        },
        data: {
          hasSeenLatestMessage: true,
        },
      });

      return true;
    } catch (error: any) {
      console.log('markConversationAsRead error', error);
      throw new GraphQLError(error.message);
    }
  }
}
