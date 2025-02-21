import { IEvent } from '@nestjs/cqrs';

export class SignUpUserEvent implements IEvent {
  constructor(
    public readonly userId: string,
    public readonly username: string,
  ) {}
}
