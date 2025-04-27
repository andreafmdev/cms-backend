import { DomainError } from '@shared/domain/errors/domain-error';

export class CategoryDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_TRANSLATIONS: 'MISSING_TRANSLATIONS',
    MISSING_ATTRIBUTES: 'MISSING_ATTRIBUTES',
    DATA_CORRUPTION: 'DATA_CORRUPTION',
    TRANSLATION_NOT_FOUND: 'TRANSLATION_NOT_FOUND',
    DUPLICATE_TRANSLATION: 'DUPLICATE_TRANSLATION',
    ATTRIBUTE_ALREADY_EXISTS: 'ATTRIBUTE_ALREADY_EXISTS',
    ATTRIBUTE_BELONGS_TO_ANOTHER_CATEGORY:
      'ATTRIBUTE_BELONGS_TO_ANOTHER_CATEGORY',
    MISSING_ATTRIBUTE_ID: 'MISSING_ATTRIBUTE_ID',
    MISSING_CATEGORY_ID: 'MISSING_CATEGORY_ID',
  } as const;
  constructor(
    message: string,
    public readonly code: keyof typeof CategoryDomainError.ERRORS,
  ) {
    super(message);
  }
  static missingTranslations(): CategoryDomainError {
    return new CategoryDomainError(
      'Category translations are required',
      CategoryDomainError.ERRORS.MISSING_TRANSLATIONS,
    );
  }
  static missingAttributes(): CategoryDomainError {
    return new CategoryDomainError(
      'Category attributes are required',
      CategoryDomainError.ERRORS.MISSING_ATTRIBUTES,
    );
  }
  static dataCorruption(): CategoryDomainError {
    return new CategoryDomainError(
      'Data corruption detected',
      CategoryDomainError.ERRORS.DATA_CORRUPTION,
    );
  }
  static translationNotFound(languageCode: string): CategoryDomainError {
    return new CategoryDomainError(
      `Translation for language code ${languageCode} not found`,
      CategoryDomainError.ERRORS.TRANSLATION_NOT_FOUND,
    );
  }
  static duplicateTranslation(languageCode: string): CategoryDomainError {
    return new CategoryDomainError(
      `Duplicate translation for language code ${languageCode}`,
      CategoryDomainError.ERRORS.DUPLICATE_TRANSLATION,
    );
  }
  static attributeAlreadyExists(attributeId: string): CategoryDomainError {
    return new CategoryDomainError(
      `Attribute with id ${attributeId} already exists`,
      CategoryDomainError.ERRORS.ATTRIBUTE_ALREADY_EXISTS,
    );
  }
  static attributeBelongsToAnotherCategory(
    attributeId: string,
    categoryId: string,
  ): CategoryDomainError {
    return new CategoryDomainError(
      `Attribute with id ${attributeId} belongs to another category with id ${categoryId}`,
      CategoryDomainError.ERRORS.ATTRIBUTE_BELONGS_TO_ANOTHER_CATEGORY,
    );
  }
  static missingAttributeId(): CategoryDomainError {
    return new CategoryDomainError(
      'Attribute ID is required',
      CategoryDomainError.ERRORS.MISSING_ATTRIBUTE_ID,
    );
  }
  static missingCategoryId(): CategoryDomainError {
    return new CategoryDomainError(
      'Category ID is required',
      CategoryDomainError.ERRORS.MISSING_CATEGORY_ID,
    );
  }
}
