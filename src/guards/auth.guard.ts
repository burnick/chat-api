import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getSession } from 'next-auth/react';
// import { Observable } from 'rxjs';
// import Session from '../common/middleware/session.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = await getSession({ req: request });
    const myArray = context.getArgs();
    if (!session) {
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
