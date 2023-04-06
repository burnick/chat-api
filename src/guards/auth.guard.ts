import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getSession } from 'next-auth/react';
// import Session from '../common/middleware/session.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = await ctx?.getContext();

    try {
      if (request?.sessionUser && request?.req) {
        const session = await getSession({
          req: request?.req,
        });
        return !!session;
      }
    } catch (e: unknown) {
      console.error('error unable to read session');
    }

    return !!request?.sessionUser;
  }
}
