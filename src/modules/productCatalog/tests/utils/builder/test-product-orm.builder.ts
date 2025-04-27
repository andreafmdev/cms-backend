import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { TEST_CONSTANTS } from '../constants/test-constants';
import { ProductImageOrmEntity } from '@module/productCatalog/infrastructure/entities/product-image.orm-entity';
import { ProductTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-translation.orm-entity';
import { ProductId } from '../../../domain/value-objects/product-id';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { ProductCategoryAttributeValueOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-value.orm-entity';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';

// src/modules/productCatalog/tests/utils/builder/test-product-orm.builder.ts
export class TestProductOrmBuilder {
  private entity: ProductOrmEntity;
  private productId: ProductId;
  private brandId: BrandId;
  private categoryId: CategoryId;
  constructor() {
    this.productId = ProductId.create();
    this.brandId = BrandId.create();
    this.categoryId = CategoryId.create();
    this.reset();
  }

  private reset(): void {
    this.entity = new ProductOrmEntity();

    this.entity.id = this.productId.toString();
    this.entity.price = TEST_CONSTANTS.PRODUCT.PRICE;
    this.entity.isAvailable = true;
    this.entity.brandId = this.brandId.toString();
    this.entity.categoryId = this.categoryId.toString();
    this.entity.translations = [this.createDefaultTranslation()];
    this.entity.images = [this.createDefaultImage()];
    this.entity.attributesValues = [this.createDefaultAttribute()];
  }

  private createDefaultTranslation(): ProductTranslationOrmEntity {
    const translation = new ProductTranslationOrmEntity();
    translation.productId = this.productId.toString();
    translation.languageCode = TEST_CONSTANTS.LANGUAGE_CODE.IT;
    translation.name = TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME;
    translation.description =
      TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION;
    return translation;
  }

  private createDefaultImage(): ProductImageOrmEntity {
    const image = new ProductImageOrmEntity();
    image.productId = this.productId.toString();
    image.url = TEST_CONSTANTS.PRODUCT.IMAGES[0].URL;
    image.isMain = TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN;
    return image;
  }

  private createDefaultAttribute(): ProductCategoryAttributeValueOrmEntity {
    const attribute = new ProductCategoryAttributeValueOrmEntity();
    attribute.productId = this.productId.toString();
    const attributeId = ProductCategoryAttributeId.create();
    attribute.attributeId = attributeId.toString();
    attribute.value =
      TEST_CONSTANTS.PRODUCT.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE;
    return attribute;
  }
  withPrice(price: number): TestProductOrmBuilder {
    this.entity.price = price;
    return this;
  }

  withoutAttributesValues(): TestProductOrmBuilder {
    this.entity.attributesValues = [];
    return this;
  }

  // ... altri metodi builder ...

  build(): ProductOrmEntity {
    return this.entity;
  }
  getProductId(): ProductId {
    return this.productId;
  }
  getBrandId(): BrandId {
    return this.brandId;
  }
  getCategoryId(): CategoryId {
    return this.categoryId;
  }

  static create(): TestProductOrmBuilder {
    return new TestProductOrmBuilder();
  }
}
