import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { TEST_CONSTANTS } from '../constants/test-constants';

export class TestBrandBuilder {
  private brand: Brand;

  constructor() {
    this.brand = Brand.create({
      name: TEST_CONSTANTS.BRAND.YAMAHA.NAME,
    });
  }

  withName(name: string): TestBrandBuilder {
    this.brand = this.brand.updateName(name);
    return this;
  }

  build(): Brand {
    return this.brand;
  }
  static create(): TestBrandBuilder {
    return new TestBrandBuilder();
  }
}
