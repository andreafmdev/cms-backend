import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SignUpUserEvent } from './sign-up-user.event';

@EventsHandler(SignUpUserEvent)
export class SignUpUserEventHandler implements IEventHandler<SignUpUserEvent> {
  handle(event: SignUpUserEvent) {
    console.log(
      `🎉 Nuovo utente registrato: ${event.username} (ID: ${event.userId})`,
    );
    // Qui puoi eseguire altre azioni (es: inviare email, notifiche, logging, ecc.)
  }
}
