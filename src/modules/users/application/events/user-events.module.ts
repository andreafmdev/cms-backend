import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserDomainEventHandler } from '@module/users/application/events/user-domain-event.handler';
import { SendWelcomeEmailHandler } from '@module/users/application/events/send-welcome-email.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    UserDomainEventHandler, // Trasforma il Domain Event in CQRS Event
    SendWelcomeEmailHandler, // Reagisce all'evento CQRS
  ],
})
export class UserEventsModule {}
