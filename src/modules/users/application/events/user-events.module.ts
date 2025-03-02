import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserSignedUpEventHandler } from './user-signed-up.handler';
@Module({
  imports: [CqrsModule],
  providers: [
    UserSignedUpEventHandler, // Trasforma il Domain Event in CQRS Event
  ],
})
export class UserEventsModule {}
