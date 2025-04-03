import { Product } from '@module/productCatalog/domain/aggregates/product';
import { Injectable } from '@nestjs/common';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { ProductTranslationMapper } from './product-translation.mapper';
@Injectable()
export class ProductMapper {
  constructor(
    private readonly productTranslationMapper: ProductTranslationMapper,
  ) {}
  /**
   * Map an ORM entity to a domain entity
   */
  toDomain(orm: ProductOrmEntity): Product {
    const translations: ProductTranslation[] = orm.translations.map((t) =>
      this.productTranslationMapper.toDomain(t),
    );
    return Product.reconstitute({
      id: orm.id,
      translations,
      price: orm.price,
      isAvailable: orm.isAvailable,
      image: '',
      brand: undefined,
      category: undefined,
      productAttributes: [],
    });
  }
  /**
   * Map a domain entity to an ORM entity
   */
  toPersistence(domainEntity: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.id = domainEntity.getId()!.getNumberValue();
    orm.price = domainEntity.getPrice();
    orm.isAvailable = domainEntity.getIsAvailable();
    orm.translations = domainEntity
      .getLocalizations()
      .map((t) => this.productTranslationMapper.toPersistence(t));
    return orm;
  }
}
