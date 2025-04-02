import { BrandId } from '../value-objects/brand-id';
import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
export class Brand extends BaseDomainEntity<BrandId> {
  private name: string;

  private constructor(id: BrandId, name: string) {
    super(id);
    this.name = name;
  }
  static create(name: string): Brand {
    return new Brand(BrandId.create(), name);
  }
  static reconstitute(id: BrandId, name: string): Brand {
    return new Brand(id, name);
  }
  getName(): string {
    return this.name;
  }
}
