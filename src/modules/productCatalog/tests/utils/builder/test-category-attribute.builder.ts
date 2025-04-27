import { ProductCategoryAttribute } from '@module/productCatalog/domain/entities/product-category-attribute';
import { TEST_CONSTANTS } from '../constants/test-constants';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';

export class TestCategoryAttributeBuilder {
  private attribute: ProductCategoryAttribute;

  constructor() {
    this.attribute = ProductCategoryAttribute.create({
      translations: [this.createDefaultTranslationIT()],
      categoryId: CategoryId.create(),
    });
  }

  private createDefaultTranslationIT(): ProductCategoryAttributeTranslation {
    return ProductCategoryAttributeTranslation.create({
      value:
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
    });
  }
  private createDefaultTranslationEN(): ProductCategoryAttributeTranslation {
    return ProductCategoryAttributeTranslation.create({
      value:
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN.VALUE,
      languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
    });
  }
  build(): ProductCategoryAttribute {
    return this.attribute;
  }
  reset(): void {
    this.attribute = ProductCategoryAttribute.create({
      translations: [this.createDefaultTranslationIT()],
      categoryId: CategoryId.create(),
    });
  }
  withoutTranslations(): TestCategoryAttributeBuilder {
    this.attribute = ProductCategoryAttribute.create({
      translations: [],
      categoryId: CategoryId.create(),
    });
    return this;
  }
  withItalianTranslation(): TestCategoryAttributeBuilder {
    this.attribute = ProductCategoryAttribute.create({
      translations: [this.createDefaultTranslationIT()],
      categoryId: CategoryId.create(),
    });
    return this;
  }
  withEnglishTranslation(): TestCategoryAttributeBuilder {
    this.attribute = ProductCategoryAttribute.create({
      translations: [
        this.createDefaultTranslationIT(),
        this.createDefaultTranslationEN(),
      ],
      categoryId: CategoryId.create(),
    });
    return this;
  }

  static create(): TestCategoryAttributeBuilder {
    return new TestCategoryAttributeBuilder();
  }
}
