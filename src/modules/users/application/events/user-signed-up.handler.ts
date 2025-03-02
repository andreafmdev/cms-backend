import { EventsHandler, IEventHandler, EventBus } from '@nestjs/cqrs';
import { UserSignedUpDomainEvent } from '@module/users/domain/events/user-signed-up.event';

@EventsHandler(UserSignedUpDomainEvent)
export class UserSignedUpEventHandler
  implements IEventHandler<UserSignedUpDomainEvent>
{
  constructor(private readonly eventBus: EventBus) {}

  handle(event: UserSignedUpDomainEvent): void {
    console.log(
      `User signed up: ${event.userId.toString()} with email ${event.email}` +
        '📩 Invio email di benvenuto a ${event.email}',
    );
  }
}
