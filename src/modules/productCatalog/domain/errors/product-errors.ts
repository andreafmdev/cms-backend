import { DomainError } from '@shared/domain/errors/domain-error';
import { ProductCategoryAttributeId } from '../value-objects/product-category-attribute-id';
import { CategoryId } from '../value-objects/category-id';
import { LanguageCode } from '../value-objects/language-code';

export class ProductDomainError extends DomainError {
  static readonly ERRORS = {
    INVALID_PRICE: 'INVALID_PRICE',
    MISSING_CATEGORY: 'MISSING_CATEGORY',
    NO_TRANSLATIONS: 'NO_TRANSLATIONS',
    MISSING_BRAND: 'MISSING_BRAND',
    INVALID_ATTRIBUTE_VALUE: 'INVALID_ATTRIBUTE_VALUE',
    ATTRIBUTE_NOT_FOUND: 'ATTRIBUTE_NOT_FOUND',
    ATTRIBUTE_NOT_ALLOWED_FOR_CATEGORY: 'ATTRIBUTE_NOT_ALLOWED_FOR_CATEGORY',
    DUPLICATE_TRANSLATION: 'DUPLICATE_TRANSLATION',
    TRANSLATION_NOT_FOUND: 'TRANSLATION_NOT_FOUND',
  } as const;

  constructor(
    message: string,
    public readonly code: keyof typeof ProductDomainError.ERRORS,
  ) {
    super(message);
  }
  /**
   * Error thrown when a price is invalid
   * @param price - The invalid price
   * @returns The error
   */
  static invalidPrice(price: number): ProductDomainError {
    return new ProductDomainError(
      `The price ${price} is not valid. It must be greater than zero.`,
      ProductDomainError.ERRORS.INVALID_PRICE,
    );
  }
  /**
   * Error thrown when a category is missing
   * @returns The error
   */
  static missingCategory(): ProductDomainError {
    return new ProductDomainError(
      'The category is required.',
      ProductDomainError.ERRORS.MISSING_CATEGORY,
    );
  }
  /**
   * Error thrown when a product has no translations
   * @returns The error
   */
  static noTranslations(): ProductDomainError {
    return new ProductDomainError(
      'The product must have at least one translation.',
      ProductDomainError.ERRORS.NO_TRANSLATIONS,
    );
  }
  /**
   * Error thrown when a brand is missing
   * @returns The error
   */
  static missingBrand(): ProductDomainError {
    return new ProductDomainError(
      'The brand is required.',
      ProductDomainError.ERRORS.MISSING_BRAND,
    );
  }
  /**
   * Error thrown when an attribute value is invalid
   * @param value - The invalid attribute value
   * @returns The error
   */
  static invalidAttributeValue(value: string): ProductDomainError {
    return new ProductDomainError(
      `The attribute value ${value} is invalid.`,
      ProductDomainError.ERRORS.INVALID_ATTRIBUTE_VALUE,
    );
  }
  /**
   * Error thrown when an attribute is not found
   * @param attributeId - The ID of the attribute
   * @returns The error
   */
  static attributeNotFound(
    attributeId: ProductCategoryAttributeId,
  ): ProductDomainError {
    return new ProductDomainError(
      `The attribute with ID ${attributeId.getValue().toString()} was not found.`,
      ProductDomainError.ERRORS.ATTRIBUTE_NOT_FOUND,
    );
  }
  /**
   * Error thrown when an attribute is not allowed for a category
   * @param attributeId - The ID of the attribute
   * @param categoryId - The ID of the category
   * @returns The error
   */
  static attributeNotAllowedForCategory(
    attributeId: ProductCategoryAttributeId,
    categoryId: CategoryId,
  ): ProductDomainError {
    return new ProductDomainError(
      `The attribute with ID ${attributeId.getValue().toString()} is not allowed for the category with ID ${categoryId.getValue().toString()}.`,
      ProductDomainError.ERRORS.ATTRIBUTE_NOT_ALLOWED_FOR_CATEGORY,
    );
  }
  /**
   * Error thrown when a translation is duplicate
   * @param languageCode - The language code of the translation
   * @returns The error
   */
  static duplicateTranslation(languageCode: LanguageCode): ProductDomainError {
    return new ProductDomainError(
      `The translation with language code ${languageCode.getValue().toString()} is already present.`,
      ProductDomainError.ERRORS.DUPLICATE_TRANSLATION,
    );
  }
  /**
   * Error thrown when a translation is not found
   * @param languageCode - The language code of the translation
   * @returns The error
   */
  static translationNotFound(languageCode: LanguageCode): ProductDomainError {
    return new ProductDomainError(
      `The translation with language code ${languageCode.getValue().toString()} was not found.`,
      ProductDomainError.ERRORS.TRANSLATION_NOT_FOUND,
    );
  }
}
