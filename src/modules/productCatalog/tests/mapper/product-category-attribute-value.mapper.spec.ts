import { ProductCategoryAttributeValueMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-value-mapper';
import { ProductCategoryAttributeValueOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-value.orm-entity';
import { ProductCategoryAttributeValue } from '@module/productCatalog/domain/entities/product-category-attribute-value';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';

describe('Product category attribute value mapper', () => {
  let productCategoryAttributeValueMapper: ProductCategoryAttributeValueMapper;
  let attributeId: ProductCategoryAttributeId;
  let value: string;
  let productId: ProductId;
  beforeEach(() => {
    productCategoryAttributeValueMapper =
      new ProductCategoryAttributeValueMapper();
    attributeId = ProductCategoryAttributeId.create();
    productId = ProductId.create();
    value = 'Test Value';
  });

  describe('toDomain', () => {
    it('should map ORM entity to domain entity', () => {
      const ormEntity = new ProductCategoryAttributeValueOrmEntity();
      ormEntity.attributeId = attributeId.toString();
      ormEntity.productId = productId.toString();
      ormEntity.value = value;

      const domainEntity =
        productCategoryAttributeValueMapper.toDomain(ormEntity);

      expect(domainEntity).toBeDefined();

      expect(domainEntity.getAttributeId().toString()).toBe(
        attributeId.toString(),
      );
      expect(domainEntity.getProductId().toString()).toBe(productId.toString());
      expect(domainEntity.getValue()).toBe(value);
    });
  });

  describe('toOrm', () => {
    it('should map domain entity to ORM entity', () => {
      const domainEntity = ProductCategoryAttributeValue.create({
        attributeId: attributeId,
        value: value,
        productId: productId,
      });

      const ormEntity =
        productCategoryAttributeValueMapper.toPersistence(domainEntity);

      expect(ormEntity).toBeDefined();
      expect(ormEntity.attributeId).toBe(attributeId.toString());
      expect(ormEntity.value).toBe(value);
    });
  });
});
