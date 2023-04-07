import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const sessionUser =
      ctx.getContext().sessionUser?.user ??
      ctx.getContext().req.connectionParams?.session.user;
    const myObservable = new Observable<boolean>((observer) => {
      for (let i = 0; i < 5; i++) {
        if (sessionUser?.id) {
          observer.next(true);
        }
        if (i >= 5) {
          observer.next(false);
          observer.complete();
          break;
        }
      }
    }).pipe(
      skipWhile((val) => val !== true),
      take(1),
    );

    return myObservable;
  }
}
