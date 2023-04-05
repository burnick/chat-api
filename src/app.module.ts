import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { loggingMiddleware } from './common/middleware/logging.middleware';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { PrismaModule } from 'nestjs-prisma';
import { configService } from './config/config.service';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { getSession } from 'next-auth/react';
// import { GraphQLRequest } from '@apollo/server';
import { IncomingMessage } from 'http';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: !configService.isProduction(),
      installSubscriptionHandlers: true,
      subscriptions: {
        // enable this for subscriptions
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
      context: async ({ req }: { req: IncomingMessage | undefined }) => {
        const session = await getSession({ req });
        return { sessionUser: session };
      },
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
          extensions: !configService.isProduction() ? error.extensions : {},
        };
        return graphQLFormattedError;
      },
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(new Logger('PrismaMiddleware'))], // configure your prisma middleware
      },
    }),
    UsersModule,
    ConversationsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
