import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getSession } from 'next-auth/react';
// import Session from '../common/middleware/session.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    try {
      const session = await getSession({
        req: ctx.getContext()?.req,
      });
      return !!session;
    } catch (e: unknown) {
      console.error('error unable to read session');
    }

    return false;
  }
}
