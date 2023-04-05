import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { PrismaService } from 'src/prisma.service';
import { UsersModule } from 'src/users/users.module';
import { EventModule } from '../event.module';

@Module({
  imports: [EventModule, UsersModule],
  providers: [MessagesResolver, MessagesService, PrismaService],
})
export class MessagesModule {}
