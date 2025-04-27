import { DomainError } from '@shared/domain/errors/domain-error';

export class CategoryTranslationDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_NAME: 'MISSING_NAME',
    MISSING_LANGUAGE_CODE: 'MISSING_LANGUAGE_CODE',
    MISSING_CATEGORY_ID: 'MISSING_CATEGORY_ID',
  } as const;
  constructor(
    message: string,
    public readonly code: keyof typeof CategoryTranslationDomainError.ERRORS,
  ) {
    super(message);
  }
  static missingName(): CategoryTranslationDomainError {
    return new CategoryTranslationDomainError(
      'Name is required',
      CategoryTranslationDomainError.ERRORS.MISSING_NAME,
    );
  }
  static missingLanguageCode(): CategoryTranslationDomainError {
    return new CategoryTranslationDomainError(
      'Language code is required',
      CategoryTranslationDomainError.ERRORS.MISSING_LANGUAGE_CODE,
    );
  }
  static missingCategoryId(): CategoryTranslationDomainError {
    return new CategoryTranslationDomainError(
      'Category ID is required',
      CategoryTranslationDomainError.ERRORS.MISSING_CATEGORY_ID,
    );
  }
}
