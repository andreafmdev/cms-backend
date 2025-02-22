import { EntityId } from '@shared/kernel/BaseDomainEntity';
import { Uuid } from '@shared/value-object/uuid.vo';

/**
 * Value Object for Group ID
 */
export class GroupId implements EntityId<Uuid> {
  private readonly value: Uuid;
  private constructor(private readonly id: Uuid) {
    this.value = id;
  }
  //if not defined it created it
  static create(value?: string): GroupId {
    return new GroupId(value ? Uuid.fromString(value) : Uuid.generate());
  }

  getValue(): Uuid {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: EntityId): boolean {
    if (!other) return false;
    return this.toString() === other.toString();
  }
}
