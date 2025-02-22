import { EventsHandler, IEventHandler, EventBus } from '@nestjs/cqrs';
import { UserSignedUpDomainEvent } from '@module/users/domain/events/user-signed-up.event';
import { UserSignedUpEvent } from '@module/users/application/events/user-signed-up.event';

@EventsHandler(UserSignedUpDomainEvent)
export class UserDomainEventHandler
  implements IEventHandler<UserSignedUpDomainEvent>
{
  constructor(private readonly eventBus: EventBus) {}

  handle(event: UserSignedUpDomainEvent): void {}
}
