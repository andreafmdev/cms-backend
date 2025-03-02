import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserSignedUpEvent } from '@module/users/application/events/user-signed-up.event';
import { NotificationService } from '@module/mailer/mailer.service';
@EventsHandler(UserSignedUpEvent)
export class SendWelcomeEmailHandler
  implements IEventHandler<UserSignedUpEvent>
{
  constructor(private readonly notificationService: NotificationService) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    console.log(
      `📩 Invio email di benvenuto a ${event.email} e ${event.userId}`,
    );
    const { email, userId } = event;
    await this.notificationService.sendWelcomeEmail(email, userId);
  }
}
