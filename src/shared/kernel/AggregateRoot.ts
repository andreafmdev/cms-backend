import { BaseDomainEntity, EntityId } from './BaseDomainEntity';
import { DomainEvent } from './DomainEvent';

/**
 * Base class for aggregate roots in the domain model
 */
export abstract class AggregateRoot<
  T extends EntityId,
> extends BaseDomainEntity<T> {
  /** List of domain events that occurred */
  private _domainEvents: DomainEvent[] = [];

  /** Returns an immutable copy of domain events */
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /** Adds a new domain event to the list */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
    this.logDomainEvent(event);
  }

  /** Removes a specific domain event from the list */
  protected removeDomainEvent(event: DomainEvent): void {
    const index = this._domainEvents.findIndex((e) => e === event);
    if (index >= 0) {
      this._domainEvents.splice(index, 1);
    }
  }

  /** Clears all domain events */
  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  /** Logs domain event for debugging purposes */
  private logDomainEvent(event: DomainEvent): void {
    // Per debug/logging
    console.log(
      `[Domain Event] ${this.constructor.name} - ${event.constructor.name}`,
    );
  }

  /**
   * Applies a domain event and updates the aggregate's timestamp
   * @param event The domain event to apply
   */
  protected apply(event: DomainEvent): void {
    this.addDomainEvent(event);
    this.updateTimestamp();
  }
}
