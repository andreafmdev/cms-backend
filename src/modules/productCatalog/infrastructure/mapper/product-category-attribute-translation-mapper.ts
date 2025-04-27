import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { Injectable } from '@nestjs/common';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductCategoryAttributeTranslationOrmEntity } from '../entities/product-category-attribute-translation.orm-entity';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
@Injectable()
export class ProductCategoryAttributeTranslationMapper extends BaseMapper<
  ProductCategoryAttributeTranslation,
  ProductCategoryAttributeTranslationOrmEntity
> {
  constructor() {
    super();
  }
  toDomain(
    orm: ProductCategoryAttributeTranslationOrmEntity,
  ): ProductCategoryAttributeTranslation {
    return ProductCategoryAttributeTranslation.reconstitute({
      value: orm.value,
      languageCode: LanguageCode.create(orm.languageCode),
      attributeId: ProductCategoryAttributeId.create(orm.attributeId),
    });
  }

  toPersistence(
    domain: ProductCategoryAttributeTranslation,
  ): ProductCategoryAttributeTranslationOrmEntity {
    const orm = new ProductCategoryAttributeTranslationOrmEntity();

    orm.value = domain.getValue();
    orm.languageCode = domain.getLanguageCode().getValue();
    orm.attributeId = domain.getAttributeId().toString();
    return orm;
  }
}
