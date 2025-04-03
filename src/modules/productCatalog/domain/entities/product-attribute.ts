import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { ProductAttributeId } from '../value-objects/product-attribute-id';

export class ProductAttribute extends BaseDomainEntity<ProductAttributeId> {
  private name: string;
  private value: string;
  private constructor(name: string, value: string, id?: ProductAttributeId) {
    super(id ?? null);
    this.name = name;
    this.value = value;
  }
  static create(props: { name: string; value: string }): ProductAttribute {
    //!CHECK IF PROPS ARE NOT NULL OR INVALID

    return new ProductAttribute(props.name, props.value);
  }
  static reconstitute(props: {
    id: number;
    name: string;
    value: string;
  }): ProductAttribute {
    return new ProductAttribute(
      props.name,
      props.value,
      ProductAttributeId.create(props.id),
    );
  }
}
