import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { EventModule } from '../event.module';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [EventModule],
  providers: [ConversationsResolver, ConversationsService, PrismaService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
