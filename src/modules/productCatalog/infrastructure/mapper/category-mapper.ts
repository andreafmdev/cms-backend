import { Category } from '@module/productCatalog/domain/aggregates/category';
import { Injectable } from '@nestjs/common';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { ProductCategoryAttributeMapper } from './product-category-attribute-mapper';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { CategoryTranslationMapper } from './category-translation-mapper';

@Injectable()
export class CategoryMapper extends BaseMapper<Category, CategoryOrmEntity> {
  constructor(
    private readonly productCategoryAttributeMapper: ProductCategoryAttributeMapper,
    private readonly categoryTranslationMapper: CategoryTranslationMapper,
  ) {
    super();
  }
  toDomain(orm: CategoryOrmEntity): Category {
    return Category.reconstitute({
      id: CategoryId.create(orm.id),
      attributes: (orm.attributes ?? []).map((a) =>
        this.productCategoryAttributeMapper.toDomain(a),
      ),
      translations: (orm.translations ?? []).map((t) =>
        this.categoryTranslationMapper.toDomain(t),
      ),
    });
  }
  toPersistence(domainEntity: Category): CategoryOrmEntity {
    const orm = new CategoryOrmEntity();
    const id = domainEntity.getId();
    if (id) {
      orm.id = id.toString();
    }
    orm.attributes = domainEntity
      .getAttributes()
      .map((a) => this.productCategoryAttributeMapper.toPersistence(a));
    orm.translations = domainEntity
      .getTranslations()
      .map((t) => this.categoryTranslationMapper.toPersistence(t));
    return orm;
  }
}
