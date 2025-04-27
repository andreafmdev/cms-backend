import { Injectable } from '@nestjs/common';

import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { ProductTranslationOrmEntity } from '../entities/product-translation.orm-entity';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
@Injectable()
export class ProductTranslationMapper extends BaseMapper<
  ProductTranslation,
  ProductTranslationOrmEntity
> {
  constructor() {
    super();
  }
  /**
   * Map an ORM entity to a domain entity
   */
  toDomain(orm: ProductTranslationOrmEntity): ProductTranslation {
    const productTranslation: ProductTranslation =
      ProductTranslation.reconstitute({
        languageCode: LanguageCode.create(orm.languageCode),
        name: orm.name,
        description: orm.description,
        productId: ProductId.create(orm.productId),
      });
    return productTranslation;
  }
  /**
   * Map a domain entity to an ORM entity
   */
  toPersistence(domainEntity: ProductTranslation): ProductTranslationOrmEntity {
    const orm = new ProductTranslationOrmEntity();

    orm.languageCode = domainEntity.getLanguageCode().getValue();
    orm.name = domainEntity.getName();
    orm.description = domainEntity.getDescription();
    orm.productId = domainEntity.getProductId().toString();
    return orm;
  }
}
