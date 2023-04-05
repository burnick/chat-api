import { Module } from '@nestjs/common';
import { EventModule } from '../event.module';
import { PrismaService } from '../prisma.service';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  imports: [EventModule],
  providers: [UsersResolver, UsersService, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
