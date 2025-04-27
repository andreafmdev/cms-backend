import {
  Product,
  CreateProductProps,
} from '@module/productCatalog/domain/aggregates/product';
import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { ProductImage } from '@module/productCatalog/domain/entities/product-image';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { ProductCategoryAttributeValue } from '@module/productCatalog/domain/entities/product-category-attribute-value';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { TEST_CONSTANTS } from '../constants/test-constants';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { ImageUrl } from '@module/productCatalog/domain/value-objects/image-url';

export class TestProductBuilder {
  private props: CreateProductProps;
  private productId: ProductId;

  constructor() {
    this.productId = ProductId.create();
    this.reset();
  }

  private reset(): void {
    this.props = {
      id: this.productId,
      translations: [this.createDefaultTranslation()],
      price: TEST_CONSTANTS.PRODUCT.PRICE,
      isAvailable: true,
      image: [this.createDefaultImage()],
      brandId: BrandId.create(),
      categoryId: CategoryId.create(),
      attributesValues: [this.createDefaultAttribute()],
    };
  }

  private createDefaultTranslation(): ProductTranslation {
    return ProductTranslation.create({
      languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
      name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
      description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
      productId: this.productId,
    });
  }

  private createDefaultImage(): ProductImage {
    return ProductImage.create({
      url: ImageUrl.create(TEST_CONSTANTS.PRODUCT.IMAGES[0].URL),
      isMain: TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
    });
  }

  private createDefaultBrand(): Brand {
    return Brand.create({
      name: TEST_CONSTANTS.BRAND.YAMAHA.NAME,
    });
  }

  private createDefaultAttribute(): ProductCategoryAttributeValue {
    const attributeId = ProductCategoryAttributeId.create();
    return ProductCategoryAttributeValue.create({
      attributeId,
      value:
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      productId: this.productId,
    });
  }

  // Builder methods
  withPrice(price: number): TestProductBuilder {
    this.props.price = price;
    return this;
  }

  withNegativePrice(): TestProductBuilder {
    return this.withPrice(-100);
  }

  withoutBrand(): TestProductBuilder {
    this.props.brandId = undefined as unknown as BrandId;
    return this;
  }

  withIsAvailable(isAvailable: boolean): TestProductBuilder {
    this.props.isAvailable = isAvailable;
    return this;
  }

  withImages(images: ProductImage[]): TestProductBuilder {
    this.props.image = images;
    return this;
  }

  withoutImages(): TestProductBuilder {
    this.props.image = [];
    return this;
  }

  withoutTranslations(): TestProductBuilder {
    this.props.translations = [];
    return this;
  }
  withoutCategoryId(): TestProductBuilder {
    this.props.categoryId = undefined as unknown as CategoryId;
    return this;
  }
  withTranslations(translations: ProductTranslation[]): TestProductBuilder {
    this.props.translations = translations;
    return this;
  }

  withEmptyTranslations(): TestProductBuilder {
    this.props.translations = [];
    return this;
  }

  withCategoryId(categoryId: CategoryId): TestProductBuilder {
    this.props.categoryId = categoryId;
    return this;
  }

  withAttributesValues(
    attributesValues: ProductCategoryAttributeValue[],
  ): TestProductBuilder {
    this.props.attributesValues = attributesValues;
    return this;
  }

  withAttribute(attribute: ProductCategoryAttributeValue): TestProductBuilder {
    this.props.attributesValues = [...this.props.attributesValues, attribute];
    return this;
  }

  withAttributeValue(
    attributeId: ProductCategoryAttributeId,
    value: string,
  ): TestProductBuilder {
    const attribute = ProductCategoryAttributeValue.create({
      attributeId,
      value,
      productId: this.productId,
    });
    return this.withAttribute(attribute);
  }

  withDefaultAttributes(): TestProductBuilder {
    const attributes = [
      ProductCategoryAttributeValue.create({
        attributeId: ProductCategoryAttributeId.create(
          TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
        ),
        value:
          TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
        productId: this.productId,
      }),
      ProductCategoryAttributeValue.create({
        attributeId: ProductCategoryAttributeId.create(
          TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.COLOR.TRANSLATIONS.IT.VALUE,
        ),
        value:
          TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.COLOR.TRANSLATIONS.IT.VALUE,
        productId: this.productId,
      }),
    ];
    this.props.attributesValues = attributes;
    return this;
  }

  withoutAttributesValues(): TestProductBuilder {
    this.props.attributesValues = [];
    return this;
  }

  withMinimumRequiredProps(): TestProductBuilder {
    this.props = {
      id: this.productId,
      translations: [this.createDefaultTranslation()],
      price: TEST_CONSTANTS.PRODUCT.PRICE,
      isAvailable: true,
      image: [],
      brandId: BrandId.create(),
      categoryId: CategoryId.create(),
      attributesValues: [],
    };
    return this;
  }

  // Build methods
  build(): Product {
    return Product.create(this.props);
  }

  // Utility methods
  clone(): TestProductBuilder {
    const builder = new TestProductBuilder();
    builder.props = { ...this.props };
    return builder;
  }

  static create(): TestProductBuilder {
    return new TestProductBuilder();
  }
}
