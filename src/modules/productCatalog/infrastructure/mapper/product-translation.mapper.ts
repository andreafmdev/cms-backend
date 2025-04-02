import { Injectable } from '@nestjs/common';

import { ProductTranslationId } from '@module/productCatalog/domain/value-objects/product-translation-id';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { ProductTranslationOrmEntity } from '../entities/product-translation.orm-entity';
@Injectable()
export class ProductTranslationMapper {
  constructor() {}
  /**
   * Map an ORM entity to a domain entity
   */
  toDomain(orm: ProductTranslationOrmEntity): ProductTranslation {
    const productTranslationId = ProductTranslationId.create(orm.id);
    const productTranslation: ProductTranslation =
      ProductTranslation.reconstitute(productTranslationId, {
        languageCode: orm.languageCode,
        name: orm.name,
        description: orm.description,
      });
    return productTranslation;
  }
  /**
   * Map a domain entity to an ORM entity
   */
  toPersistence(domainEntity: ProductTranslation): ProductTranslationOrmEntity {
    const orm = new ProductTranslationOrmEntity();
    orm.id = domainEntity.getId().toString();
    orm.languageCode = domainEntity.getLanguageCode();
    orm.name = domainEntity.getName();
    orm.description = domainEntity.getDescription();
    return orm;
  }
}
