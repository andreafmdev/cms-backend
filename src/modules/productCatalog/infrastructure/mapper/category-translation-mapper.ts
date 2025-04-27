import { Injectable } from '@nestjs/common';
import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
@Injectable()
export class CategoryTranslationMapper extends BaseMapper<
  CategoryTranslation,
  CategoryTranslationOrmEntity
> {
  //#region TO DOMAIN
  toDomain(orm: CategoryTranslationOrmEntity): CategoryTranslation {
    return CategoryTranslation.reconstitute({
      languageCode: LanguageCode.create(orm.languageCode),
      name: orm.name,
      description: orm.description,
      categoryId: CategoryId.create(orm.categoryId),
    });
  }
  //#endregion

  //#region TO PERSISTENCE
  toPersistence(
    domainEntity: CategoryTranslation,
  ): CategoryTranslationOrmEntity {
    const orm = new CategoryTranslationOrmEntity();
    orm.languageCode = domainEntity.getLanguageCode().getValue();
    orm.name = domainEntity.getName();
    orm.description = domainEntity.getDescription();
    orm.categoryId = domainEntity.getCategoryId().toString();
    return orm;
  }
  //#endregion
}
