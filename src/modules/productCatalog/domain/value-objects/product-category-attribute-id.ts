import { EntityId } from '@shared/kernel/BaseDomainEntity';
import { Uuid } from '@shared/value-object/uuid.vo';

export class ProductCategoryAttributeId implements EntityId<Uuid> {
  private readonly value: Uuid;
  private constructor(private readonly id: Uuid) {
    this.value = id;
  }
  /**
   * Creates a new product category attribute ID
   * @param value - The numeric value of the attribute ID
   * @returns A new product category attribute ID
   */
  static create(value?: string): ProductCategoryAttributeId {
    return new ProductCategoryAttributeId(
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
