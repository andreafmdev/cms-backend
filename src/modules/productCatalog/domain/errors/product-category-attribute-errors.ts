import { DomainError } from '@shared/domain/errors/domain-error';

export class ProductCategoryAttributeDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_NAME: 'MISSING_NAME',
    MISSING_CATEGORY_ID: 'MISSING_CATEGORY_ID',
    MISSING_TRANSLATIONS: 'MISSING_TRANSLATIONS',
    TRANSLATION_NOT_FOUND: 'TRANSLATION_NOT_FOUND',
    DUPLICATED_TRANSLATIONS: 'DUPLICATED_TRANSLATIONS',
  } as const;
  constructor(
    message: string,
    public readonly code: keyof typeof ProductCategoryAttributeDomainError.ERRORS,
  ) {
    super(message);
  }
  static missingName(): ProductCategoryAttributeDomainError {
    return new ProductCategoryAttributeDomainError(
      'Name is required',
      ProductCategoryAttributeDomainError.ERRORS.MISSING_NAME,
    );
  }
  static missingCategoryId(): ProductCategoryAttributeDomainError {
    return new ProductCategoryAttributeDomainError(
      'Category ID is required',
      ProductCategoryAttributeDomainError.ERRORS.MISSING_CATEGORY_ID,
    );
  }
  static missingTranslations(): ProductCategoryAttributeDomainError {
    return new ProductCategoryAttributeDomainError(
      'Translations are required',
      ProductCategoryAttributeDomainError.ERRORS.MISSING_TRANSLATIONS,
    );
  }
  static translationNotFound(
    languageCode: string,
  ): ProductCategoryAttributeDomainError {
    return new ProductCategoryAttributeDomainError(
      `Translation not found for language code: ${languageCode}`,
      ProductCategoryAttributeDomainError.ERRORS.TRANSLATION_NOT_FOUND,
    );
  }
  static duplicatedTranslations(
    languageCode: string,
  ): ProductCategoryAttributeDomainError {
    return new ProductCategoryAttributeDomainError(
      `Duplicated translations for language code: ${languageCode}`,
      ProductCategoryAttributeDomainError.ERRORS.DUPLICATED_TRANSLATIONS,
    );
  }
}
