import { DomainEvent } from '@shared/kernel/DomainEvent';
import { UserId } from '../value-objects/user-id.vo';
export class UserSignedUpDomainEvent extends DomainEvent {
  constructor(
    public readonly userId: UserId,
    public readonly email: string,
    public readonly username: string,
  ) {
    super(userId);
  }

  getEventName(): string {
    return 'UserSignedUp';
  }
}
