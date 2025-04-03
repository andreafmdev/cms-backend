import { BrandId } from '../value-objects/brand-id';
import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
export class Brand extends BaseDomainEntity<BrandId> {
  private name: string;

  private constructor(name: string, id?: BrandId) {
    super(id ?? null);
    this.name = name;
  }
  static create(props: { name: string }): Brand {
    //!CHECK IF PROPS ARE NOT NULL OR INVALID

    return new Brand(props.name);
  }
  static reconstitute(props: { id: number; name: string }): Brand {
    return new Brand(props.name, BrandId.create(props.id));
  }
  getName(): string {
    return this.name;
  }
}
