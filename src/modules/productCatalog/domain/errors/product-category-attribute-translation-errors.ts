import { DomainError } from '@shared/domain/errors/domain-error';

export class ProductCategoryAttributeTranslationDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_VALUE: 'MISSING_VALUE',
    MISSING_ATTRIBUTE_ID: 'MISSING_ATTRIBUTE_ID',
    MISSING_LANGUAGE_CODE: 'MISSING_LANGUAGE_CODE',
  } as const;
  constructor(
    message: string,
    public readonly code: keyof typeof ProductCategoryAttributeTranslationDomainError.ERRORS,
  ) {
    super(message);
  }
  static missingValue(): ProductCategoryAttributeTranslationDomainError {
    return new ProductCategoryAttributeTranslationDomainError(
      'Value is required',
      ProductCategoryAttributeTranslationDomainError.ERRORS.MISSING_VALUE,
    );
  }
  static missingAttributeId(): ProductCategoryAttributeTranslationDomainError {
    return new ProductCategoryAttributeTranslationDomainError(
      'Attribute ID is required',
      ProductCategoryAttributeTranslationDomainError.ERRORS.MISSING_ATTRIBUTE_ID,
    );
  }
  static missingLanguageCode(): ProductCategoryAttributeTranslationDomainError {
    return new ProductCategoryAttributeTranslationDomainError(
      'Language code is required',
      ProductCategoryAttributeTranslationDomainError.ERRORS.MISSING_LANGUAGE_CODE,
    );
  }
}
