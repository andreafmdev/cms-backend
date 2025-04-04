import { EntityId } from '@shared/kernel/BaseDomainEntity';
import { IntId } from '@shared/value-object/numeric-id.vo';

export class BrandId implements EntityId<IntId> {
  private readonly value: IntId;
  private constructor(id: IntId) {
    this.value = id;
  }
  static create(value: number): BrandId {
    return new BrandId(IntId.create(value));
  }

  getValue(): IntId {
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
