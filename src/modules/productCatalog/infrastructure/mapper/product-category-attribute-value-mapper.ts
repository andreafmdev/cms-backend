import { Injectable } from '@nestjs/common';
import { ProductCategoryAttributeValueOrmEntity } from '../entities/product-category-attribute-value.orm-entity';
import { ProductCategoryAttributeValue } from '@module/productCatalog/domain/entities/product-category-attribute-value';

import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
@Injectable()
export class ProductCategoryAttributeValueMapper extends BaseMapper<
  ProductCategoryAttributeValue,
  ProductCategoryAttributeValueOrmEntity
> {
  constructor() {
    super();
  }
  toDomain(
    orm: ProductCategoryAttributeValueOrmEntity,
  ): ProductCategoryAttributeValue {
    return ProductCategoryAttributeValue.reconstitute({
      productId: ProductId.create(orm.productId),
      value: orm.value,
      attributeId: ProductCategoryAttributeId.create(orm.attributeId),
    });
  }
  toPersistence(
    domain: ProductCategoryAttributeValue,
  ): ProductCategoryAttributeValueOrmEntity {
    const orm = new ProductCategoryAttributeValueOrmEntity();
    orm.productId = domain.getProductId().toString();
    orm.attributeId = domain.getAttributeId().toString();
    orm.value = domain.getValue();
    return orm;
  }
}
