import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductCategoryAttributeDomainError } from '@module/productCatalog/domain/errors/product-category-attribute-errors';
import { ProductCategoryAttributeTranslation } from './product-category-attribute-translation';
import { CategoryId } from '../value-objects/category-id';
//#region INTERFACES
interface ProductCategoryAttributeProps {
  id: ProductCategoryAttributeId;
  categoryId: CategoryId;
  translations: ProductCategoryAttributeTranslation[];
}

type ReconstituteProps = ProductCategoryAttributeProps;
//#endregion INTERFACES

export class ProductCategoryAttribute extends BaseDomainEntity<ProductCategoryAttributeId> {
  //#region PROPERTIES
  private translations: ProductCategoryAttributeTranslation[];
  private readonly categoryId: CategoryId;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(
    translations: ProductCategoryAttributeTranslation[],
    categoryId: CategoryId,
    id: ProductCategoryAttributeId,
  ) {
    super(id);
    ProductCategoryAttribute.validateInvariants({
      translations,
    });
    this.translations = translations;
    this.categoryId = categoryId;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  static create(props: {
    translations: ProductCategoryAttributeTranslation[];
    categoryId: CategoryId;
  }): ProductCategoryAttribute {
    return new ProductCategoryAttribute(
      props.translations,
      props.categoryId,
      ProductCategoryAttributeId.create(),
    );
  }

  static reconstitute(props: ReconstituteProps): ProductCategoryAttribute {
    return new ProductCategoryAttribute(
      props.translations,
      props.categoryId,
      props.id,
    );
  }

  //#endregion FACTORY METHODS

  //#region VALIDATION
  private static validateInvariants(
    props: Partial<ProductCategoryAttributeProps>,
  ): void {
    const translations = props.translations ?? [];
    this.validateEmptyTranslations(translations);
    this.validateDuplicatedTranslations(translations);
  }

  /**
   * Validate if the translations are empty
   * @param translations - The translations to validate
   */
  private static validateEmptyTranslations(
    translations: ProductCategoryAttributeTranslation[],
  ): void {
    if (this.isNullOrUndefined(translations) || translations.length === 0) {
      throw ProductCategoryAttributeDomainError.missingTranslations();
    }
  }
  /**
   * Validate if the translations are duplicated
   * @param translations - The translations to validate
   */
  private static validateDuplicatedTranslations(
    translations: ProductCategoryAttributeTranslation[],
  ): void {
    const languageCodes = new Set();
    translations.forEach((t) => {
      const code = t.getLanguageCode().getValue();
      if (languageCodes.has(code)) {
        throw ProductCategoryAttributeDomainError.duplicatedTranslations(code);
      }
      languageCodes.add(code);
    });
  }

  private validateTranslationInvariant(
    translation: ProductCategoryAttributeTranslation,
  ): void {
    if (this.hasTranslation(translation.getLanguageCode())) {
      throw ProductCategoryAttributeDomainError.duplicatedTranslations(
        translation.getLanguageCode().getValue(),
      );
    }
  }
  //#endregion VALIDATION

  //#region GETTERS

  getTranslations(): ProductCategoryAttributeTranslation[] {
    return [...this.translations]; // Ritorna una copia per proteggere l'immutabilità / Returns a copy to protect immutability
  }

  getName(languageCode: LanguageCode): string {
    return this.getTranslation(languageCode).getValue();
  }
  hasTranslation(languageCode: LanguageCode): boolean {
    return this.translations.some((t) =>
      t.getLanguageCode().equals(languageCode),
    );
  }
  getTranslation(
    languageCode: LanguageCode,
  ): ProductCategoryAttributeTranslation {
    const translation = this.translations.find((t) =>
      t.getLanguageCode().equals(languageCode),
    );
    if (!translation) {
      throw ProductCategoryAttributeDomainError.translationNotFound(
        languageCode.getValue(),
      );
    }
    return translation;
  }

  getCategoryId(): CategoryId {
    return this.categoryId;
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  addTranslation(languageCode: LanguageCode, value: string): void {
    const translation = ProductCategoryAttributeTranslation.create({
      languageCode,
      value,
      attributeId: this.getId(),
    });
    this.validateTranslationInvariant(translation);
    this.translations.push(translation);
  }

  updateTranslation(languageCode: LanguageCode, value: string): void {
    const index = this.translations.findIndex((t) =>
      t.getLanguageCode().equals(languageCode),
    );

    if (index === -1) {
      throw ProductCategoryAttributeDomainError.translationNotFound(
        languageCode.getValue(),
      );
    }

    this.translations[index] = this.translations[index].updateValue(value);
  }

  removeTranslation(languageCode: LanguageCode): void {
    const index = this.translations.findIndex((t) =>
      t.getLanguageCode().equals(languageCode),
    );
    if (index !== -1) {
      this.translations.splice(index, 1);
    }
  }
  clearAllTranslations(): void {
    this.translations.length = 0;
  }
  replaceTranslations(
    translations: ProductCategoryAttributeTranslation[],
  ): void {
    ProductCategoryAttribute.validateInvariants({ translations });
    this.translations.length = 0;
    this.translations.push(...translations);
  }
  //#endregion BUSINESS METHODS
}
