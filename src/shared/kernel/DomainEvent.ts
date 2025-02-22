import { DomainEventInterface } from '@shared/events/domain-event.interface';
import { EntityId } from './BaseDomainEntity';
export abstract class DomainEvent implements DomainEventInterface {
  public readonly occurredOn: Date;

  constructor(
    public readonly aggregateId: EntityId,
    public readonly eventVersion: number = 1,
  ) {
    this.occurredOn = new Date();
  }
  abstract getEventName(): string;

  getAggregateId(): EntityId {
    return this.aggregateId;
  }
}
