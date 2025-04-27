import { ProductCategoryAttributeValue } from '@module/productCatalog/domain/entities/product-category-attribute-value';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductCategoryAttributeValueDomainError } from '@module/productCatalog/domain/errors/product-category-attribute-value-errors';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';

describe('ProductCategoryAttributeValue', () => {
  let attributeValue: ProductCategoryAttributeValue;
  let attributeId: ProductCategoryAttributeId;

  beforeEach(() => {
    attributeId = ProductCategoryAttributeId.create();
    attributeValue = ProductCategoryAttributeValue.create({
      value:
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      attributeId: attributeId,
      productId: ProductId.create(),
    });
  });

  describe('Creation', () => {
    it('should create a valid product category attribute value', () => {
      expect(attributeValue).toBeDefined();
      expect(attributeValue.getValue()).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      );
      expect(attributeValue.getAttributeId()).toStrictEqual(attributeId);
    });

    it('should throw an error if value is missing', () => {
      expect(() =>
        ProductCategoryAttributeValue.create({
          value: '',
          attributeId: attributeId,
          productId: ProductId.create(),
        }),
      ).toThrow();
    });

    it('should throw an error if attributeId is undefined', () => {
      expect(() =>
        ProductCategoryAttributeValue.create({
          value: 'test',
          attributeId: undefined as unknown as ProductCategoryAttributeId,
          productId: ProductId.create(),
        }),
      ).toThrow(ProductCategoryAttributeValueDomainError.missingAttributeId());
    });
  });

  describe('Update', () => {
    it('should update the value of the product category attribute value', () => {
      const updatedAttributeValue = attributeValue.updateValue('new value');

      expect(updatedAttributeValue).not.toBe(attributeValue);
      expect(updatedAttributeValue).toBeDefined();
      expect(updatedAttributeValue.getValue()).toBe('new value');
      expect(updatedAttributeValue.getAttributeId()).toStrictEqual(attributeId);
    });
  });
});
