import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

const Session = createParamDecorator(
  async (_, context: ExecutionContext): Promise<unknown> => {
    const req = context.switchToHttp().getRequest();
    // console.log('** decorator **', { ...context.switchToHttp() });
    const session = await getSession({ req });
    // console.log('** decorator **', session);

    return session;
  },
);

export default Session;
