import { EntityId } from '@shared/kernel/BaseDomainEntity';
import { Uuid } from '@shared/value-object/uuid.vo';

export class CategoryId implements EntityId<Uuid> {
  private readonly value: Uuid;
  private constructor(private readonly id: Uuid) {
    this.value = id;
  }
  static create(value?: string): CategoryId {
    return new CategoryId(value ? Uuid.fromString(value) : Uuid.generate());
  }

  getValue(): Uuid {
    return this.value;
  }
  getStringValue(): string {
    return this.value.toString();
  }

  toString(): string {
    return this.value.toString();
  }

  equals(other: EntityId): boolean {
    if (!other) return false;
    if (!(other instanceof CategoryId)) return false;
    return this.getStringValue() === other.getStringValue();
  }
}
