import { Product } from '@module/productCatalog/domain/aggregates/product';
import { Injectable } from '@nestjs/common';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { ProductTranslationMapper } from './product-translation.mapper';
import { ProductImageMapper } from './product-image-mapper';
import { ProductCategoryAttributeValueMapper } from './product-category-attribute-value-mapper';
import { BrandMapper } from './brand-mapper';
import { BaseMapper } from '@base/infrastructure/mapper/base.mapper';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
@Injectable()
export class ProductMapper extends BaseMapper<Product, ProductOrmEntity> {
  constructor(
    private readonly productTranslationMapper: ProductTranslationMapper,
    private readonly productImageMapper: ProductImageMapper,
    private readonly productCategoryAttributeValueMapper: ProductCategoryAttributeValueMapper,
    private readonly brandMapper: BrandMapper,
  ) {
    super();
  }
  /**
   * Map an ORM entity to a domain entity
   */
  toDomain(orm: ProductOrmEntity): Product {
    const translations: ProductTranslation[] = orm.translations.map((t) =>
      this.productTranslationMapper.toDomain(t),
    );
    const id = ProductId.create(orm.id);
    const images = orm.images.map((i) => this.productImageMapper.toDomain(i));

    return Product.reconstitute({
      id,
      translations,
      price: orm.price,
      isAvailable: orm.isAvailable,
      image: images,
      brandId: BrandId.create(orm.brandId),
      categoryId: CategoryId.create(orm.categoryId),
      attributesValues: (orm.attributesValues ?? []).map((a) =>
        this.productCategoryAttributeValueMapper.toDomain(a),
      ),
    });
  }
  /**
   * Map a domain entity to an ORM entity
   */
  toPersistence(domainEntity: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    const id = domainEntity.getId();
    if (id) {
      orm.id = id.toString();
    }
    const brandId = domainEntity.getBrandId();
    if (brandId) {
      orm.brandId = brandId.toString();
    }
    const categoryId = domainEntity.getCategoryId();
    if (categoryId) {
      orm.categoryId = categoryId.toString();
    }
    orm.price = domainEntity.getPrice();
    orm.isAvailable = domainEntity.getIsAvailable();
    orm.images = domainEntity
      .getProductImages()
      .map((i) => this.productImageMapper.toPersistence(i));
    orm.translations = domainEntity
      .getTranslations()
      .map((t) => this.productTranslationMapper.toPersistence(t));
    return orm;
  }
}
