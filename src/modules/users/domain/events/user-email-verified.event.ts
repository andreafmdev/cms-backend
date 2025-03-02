// In ../events/user-email-verified.event.ts
import { DomainEvent } from '@shared/kernel/DomainEvent';
import { UserId } from '../value-objects/user-id.vo';

export class UserEmailVerifiedDomainEvent extends DomainEvent {
  getEventName(): string {
    return 'user.email.verified';
  }
  constructor(
    public readonly userId: UserId,
    public readonly email: string,
  ) {
    super(userId);
  }
}
