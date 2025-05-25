import { BrandDomainError } from '@module/productCatalog/domain/errors/brand-errors';
import { TestBrandBuilder } from '../utils/builder/test-brand.builder';
import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';

describe('Brand Domain Entity', () => {
  let builder: TestBrandBuilder;

  beforeEach(() => {
    builder = new TestBrandBuilder();
  });

  describe('Creation', () => {
    it('should create a valid brand with all required properties', () => {
      const brand = builder.build();

      expect(brand).toBeDefined();
      expect(brand.getId()).toBeDefined();
      expect(brand.getName()).toBe(TEST_CONSTANTS.BRAND.YAMAHA.NAME);
    });
    it('should throw an error when creating a brand without name', () => {
      expect(() => builder.withName('').build()).toThrow(
        BrandDomainError.missingName(),
      );
    });
  });
  describe('Update', () => {
    it('should update the name of the brand', () => {
      const brand = builder.build();
      brand.updateName('New Brand Name');
      expect(brand.getName()).toBe('New Brand Name');
    });
    it('should throw an error when updating the name of the brand to an empty string', () => {
      const brand = builder.build();
      expect(() => brand.update({ name: '' })).toThrow(
        BrandDomainError.missingName(),
      );
    });
  });
  describe('Reconstitute', () => {
    it('should reconstitute a brand from a database entity', () => {
      const brand = builder.build();
      const reconstitutedBrand = Brand.reconstitute({
        id: BrandId.create(brand.getId().toString()),
        name: brand.getName(),
      });
      expect(reconstitutedBrand.getName()).toBe(brand.getName());
    });
  });
});
