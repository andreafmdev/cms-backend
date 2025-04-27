// src/modules/productCatalog/tests/builder/test-category-builder.ts
import { Category } from '../../../domain/aggregates/category';
import { CategoryTranslation } from '../../../domain/entities/category-translation';
import { LanguageCode } from '../../../domain/value-objects/language-code';
import { ProductCategoryAttribute } from '../../../domain/entities/product-category-attribute';
import { ProductCategoryAttributeTranslation } from '../../../domain/entities/product-category-attribute-translation';
import { CategoryId } from '../../../domain/value-objects/category-id';
import { TEST_CONSTANTS } from '../constants/test-constants';

/**
 * Builder for testing Category domain entity
 * it is used to create a new category or update an existing one
 * the base data are the default translations and attributes
 */

export class TestCategoryBuilder {
  private id?: CategoryId;
  private attributes: ProductCategoryAttribute[];
  private translations: CategoryTranslation[];

  constructor() {
    this.reset();
  }

  private reset(): void {
    this.attributes = [this.createDefaultAttribute()];
    this.translations = [this.createDefaultTranslationIT()];
  }

  private createDefaultAttribute(): ProductCategoryAttribute {
    return ProductCategoryAttribute.create({
      translations: [
        ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        }),
      ],
      categoryId: CategoryId.create(),
    });
  }

  private createDefaultTranslationIT(): CategoryTranslation {
    return CategoryTranslation.create({
      name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
      description: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
      languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
      categoryId: CategoryId.create(),
    });
  }
  private createDefaultTranslationEN(): CategoryTranslation {
    return CategoryTranslation.create({
      name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.EN.NAME,
      description: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.EN.DESCRIPTION,
      languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
      categoryId: CategoryId.create(),
    });
  }
  withId(id: string): TestCategoryBuilder {
    this.id = CategoryId.create(id);
    return this;
  }

  withItalianTranslation(): TestCategoryBuilder {
    this.translations = [this.createDefaultTranslationIT()];
    return this;
  }
  withEnglishTranslation(): TestCategoryBuilder {
    this.translations = [this.createDefaultTranslationEN()];
    return this;
  }
  withBilingualTranslations(): TestCategoryBuilder {
    this.translations = [
      this.createDefaultTranslationIT(),
      this.createDefaultTranslationEN(),
    ];
    return this;
  }
  withEmptyAttributes(): TestCategoryBuilder {
    this.attributes = [];
    return this;
  }

  withAttribute(attribute: ProductCategoryAttribute): TestCategoryBuilder {
    this.attributes.push(attribute);
    return this;
  }

  withEmptyTranslations(): TestCategoryBuilder {
    this.translations = [];
    return this;
  }

  withTranslation(translation: CategoryTranslation): TestCategoryBuilder {
    this.translations.push(translation);
    return this;
  }

  withMultipleTranslations(
    translations: CategoryTranslation[],
  ): TestCategoryBuilder {
    this.translations = translations;
    return this;
  }

  /**
   * Builds the Category entity
   * if the id is provided, the entity is reconstituted
   * otherwise, it is created
   * @returns Category
   */
  build(): Category {
    if (this.id) {
      return Category.reconstitute({
        id: this.id,
        attributes: this.attributes,
        translations: this.translations,
      });
    }

    return Category.create({
      id: CategoryId.create(),
      attributes: this.attributes,
      translations: this.translations,
    });
  }

  // Helper method per ricreare un builder pulito
  // Helper method to recreate a clean builder
  static create(): TestCategoryBuilder {
    return new TestCategoryBuilder();
  }
}
