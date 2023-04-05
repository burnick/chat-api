import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getSession } from 'next-auth/react';
// import Session from '../common/middleware/session.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //TODO: fix get session does not work
    const request = context.switchToHttp().getRequest();
    const session = await getSession({ req: request });

    const myArray = context.getArgs();
    if (!session) {
      // TODO: fix this hack
      for (let i = 0; i < myArray.length; i++) {
        const myObject = await myArray[i];
        if (myObject && 'sessionUser' in myObject) {
          return true;
        }
        if (i >= myArray.length) return false;
      }
    }

    return !!session;
  }
}
