import { EntityId } from '@shared/kernel/BaseDomainEntity';
import { IntId } from '@shared/value-object/numeric-id.vo';

export class ProductId implements EntityId<IntId> {
  private readonly value: IntId;
  private constructor(private readonly id: IntId) {
    this.value = id;
  }
  static create(value: number): ProductId {
    return new ProductId(IntId.create(value));
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
