import { Module } from '@nestjs/common';
import { PubSubService } from './pubsub.service';
import { EventResolver } from './event.resolver';

@Module({
  providers: [PubSubService, EventResolver],
  exports: [PubSubService],
})
export class EventModule {}
