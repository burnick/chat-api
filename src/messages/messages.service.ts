import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateMessageInput } from './dto/create-message.input';
import { UpdateMessageInput } from './dto/update-message.input';
import { User } from 'src/users/models/users.models';
import { conversationPopulated } from '../conversations/conversation-custom.resolvers';
import { PubSubService } from '../pubsub.service';
import { userIsConversationParticipant } from '../common/Functions/functions';
import Session from '../common/middleware/session.decorator';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private pubSubService: PubSubService,
  ) {}
  async create(sessionUser: Session, createMessageInput: CreateMessageInput) {
    try {
      const newMessage = await this.prisma.message.create({
        data: {
          id: createMessageInput.messageId,
          ...createMessageInput,
        },
        include: messagePopulated,
      });
      /**
       * Could cache this in production
       */
      const participant = await this.prisma.conversationParticipant.findFirst({
        where: {
          userId: sessionUser.user.id,
          conversationId: createMessageInput.conversationId,
        },
      });

      /**
       * Should always exist
       */
      if (!participant) {
        throw new GraphQLError('Participant does not exist');
      }

      const { id: participantId } = participant;

      /**
       * Update conversation latestMessage
       */
      const conversation = await this.prisma.conversation.update({
        where: {
          id: createMessageInput.conversationId,
        },
        data: {
          latestMessageId: newMessage.id,
          participants: {
            update: {
              where: {
                id: participantId,
              },
              data: {
                hasSeenLatestMessage: true,
              },
            },
            updateMany: {
              where: {
                NOT: {
                  userId: sessionUser.user.id,
                },
              },
              data: {
                hasSeenLatestMessage: false,
              },
            },
          },
        },
        include: conversationPopulated,
      });
      this.pubSubService.publish('MESSAGE_SENT', { messageSent: newMessage });
      this.pubSubService.publish('CONVERSATION_UPDATED', {
        conversationUpdated: {
          conversation,
        },
      });

      return true;
    } catch (e: unknown) {
      console.log(e);
    }
  }

  findOne() {
    return `This action returns one message`;
  }

  async findAll(sessionUser: Session, conversationId: string) {
    const { id: userId } = sessionUser.user;

    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: conversationPopulated,
    });
    if (!conversation) {
      throw new GraphQLError('Conversation Not Found');
    }
    const allowedToView = userIsConversationParticipant(
      conversation.participants,
      userId,
    );

    if (!allowedToView) {
      throw new Error('Not Authorized');
    }

    try {
      const messages = await this.prisma.message.findMany({
        where: {
          conversationId,
        },
        include: messagePopulated,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return messages;
    } catch (error: any) {
      console.log('messages error', error);
      throw new GraphQLError(error?.message);
    }
  }

  update(id: number, updateMessageInput: UpdateMessageInput) {
    return `This action updates a #${id} message`;
  }

  async remove(id: string) {
    const message = await this.prisma.message.delete({
      where: {
        id,
      },
    });

    this.pubSubService.publish('MESSAGE_DELETED', {
      messageDeleted: message,
    });
    return message;
  }
}

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    },
  },
});
