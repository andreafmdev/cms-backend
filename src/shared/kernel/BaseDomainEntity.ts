import { Uuid } from '@shared/value-object/uuid.vo';
import { IntId } from '@shared/value-object/numeric-id.vo';

/**
 * Interface for entity IDs
 */
export interface EntityId<T = Uuid | IntId> {
  equals(other: EntityId<T>): boolean;
  toString(): string;
  getValue(): T;
}

/**
 * Base class for all domain entities
 */
export abstract class BaseDomainEntity<T extends EntityId<any>> {
  private readonly id: T;
  protected readonly createdAt: Date;
  protected updatedAt: Date;

  protected constructor(id: T) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.id = id;
  }

  /** Returns the entity ID */
  public getId(): T {
    return this.id;
  }

  /** Returns ID as string */
  public getStringId(): string {
    return this.id.toString();
  }

  /** Returns entity creation timestamp */
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  /** Returns last update timestamp */
  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /** Updates the updatedAt timestamp */
  protected updateTimestamp(): void {
    this.updatedAt = new Date();
  }

  /** Checks if two entities are the same based on their IDs */
  public equals(entity: BaseDomainEntity<T>): boolean {
    if (!entity) return false;
    return this.getStringId() === entity.getStringId();
  }
}
