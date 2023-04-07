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
      if (sessionUser?.id) {
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    }).pipe(
      skipWhile((val) => val !== true),
      take(1),
    );

    return myObservable;
  }
}
