import { EntityId } from '@shared/kernel/BaseDomainEntity';

export interface DomainEventInterface {
  readonly occurredOn: Date;
  getEventName(): string;
  getAggregateId(): EntityId;
}
