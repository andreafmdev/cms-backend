import { EntityId } from '@shared/kernel/BaseDomainEntity';
import { Uuid } from '@shared/value-object/uuid.vo';

export class ProductTranslationId implements EntityId<Uuid> {
  private readonly value: Uuid;
  private constructor(private readonly id: Uuid) {
    this.value = id;
  }
  static create(value?: string): ProductTranslationId {
    return new ProductTranslationId(
      value ? Uuid.fromString(value) : Uuid.generate(),
    );
  }

  getValue(): Uuid {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }
  getStringValue(): string {
    return this.value.toString();
  }

  equals(other: EntityId): boolean {
    if (!other) return false;
    return this.toString() === other.toString();
  }
}
