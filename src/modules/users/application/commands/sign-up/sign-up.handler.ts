import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { SignUpCommand } from '@module/users/application/commands/sign-up/sign-up.command';
import { UserService } from '../../services/user.service';
import { NotificationService } from '@module/mailer/mailer.service';
@CommandHandler(SignUpCommand)
export class SignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly eventBus: EventBus,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(command: SignUpCommand): Promise<void> {
    const { username, email, password } = command;
    const user = await this.userService.createUser(username, email, password);
    user?.domainEvents.forEach((event) => {
      this.eventBus.publish(event);
    });
    user?.clearDomainEvents();
    await this.notificationService.sendWelcomeEmail(
      'freddi.dev@gmail.com',
      username,
    );
    return;
  }
}
