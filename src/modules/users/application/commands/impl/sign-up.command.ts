import { Command } from '@nestjs/cqrs';

export class SignUpCommand extends Command<void> {
  constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
