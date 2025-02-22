import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserSignedUpEvent } from '@module/users/application/events/user-signed-up.event';

@EventsHandler(UserSignedUpEvent)
export class SendWelcomeEmailHandler
  implements IEventHandler<UserSignedUpEvent>
{
  constructor() {}

  handle(event: UserSignedUpEvent): void {
    console.log(`📩 Invio email di benvenuto a ${event.email}`);
  }
}
