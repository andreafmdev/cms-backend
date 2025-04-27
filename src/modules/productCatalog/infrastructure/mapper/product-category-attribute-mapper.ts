import { Injectable } from '@nestjs/common';
import { ProductCategoryAttribute } from '@module/productCatalog/domain/entities/product-category-attribute';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { ProductCategoryAttributeOrmEntity } from '../entities/product-category-attribute.orm-entity';
import { ProductCategoryAttributeTranslationMapper } from './product-category-attribute-translation-mapper';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
@Injectable()
export class ProductCategoryAttributeMapper extends BaseMapper<
  ProductCategoryAttribute,
  ProductCategoryAttributeOrmEntity
> {
  constructor(
    private readonly productCategoryAttributeTranslationMapper: ProductCategoryAttributeTranslationMapper,
  ) {
    super();
  }
  toDomain(orm: ProductCategoryAttributeOrmEntity): ProductCategoryAttribute {
    return ProductCategoryAttribute.reconstitute({
      id: ProductCategoryAttributeId.create(orm.id),
      categoryId: CategoryId.create(orm.categoryId),
      translations: orm.translations.map((translation) =>
        this.productCategoryAttributeTranslationMapper.toDomain(translation),
      ),
    });
  }
  toPersistence(
    domain: ProductCategoryAttribute,
  ): ProductCategoryAttributeOrmEntity {
    const orm = new ProductCategoryAttributeOrmEntity();
    const id = domain.getId();
    if (id) {
      orm.id = id.toString();
    }
    orm.categoryId = domain.getCategoryId().toString();
    orm.translations = domain
      .getTranslations()
      .map((t) =>
        this.productCategoryAttributeTranslationMapper.toPersistence(t),
      );
    return orm;
  }
}
