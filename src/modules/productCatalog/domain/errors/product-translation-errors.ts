import { DomainError } from '@shared/domain/errors/domain-error';

export class ProductTranslationDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_LANGUAGE_CODE: 'MISSING_LANGUAGE_CODE',
    MISSING_NAME: 'MISSING_NAME',
    MISSING_DESCRIPTION: 'MISSING_DESCRIPTION',
    MISSING_ID: 'MISSING_ID',
    MISSING_PRODUCT_ID: 'MISSING_PRODUCT_ID',
  } as const;

  constructor(
    message: string,
    public readonly code: keyof typeof ProductTranslationDomainError.ERRORS,
  ) {
    super(message);
  }

  static missingLanguageCode(): ProductTranslationDomainError {
    return new ProductTranslationDomainError(
      'Language code is required',
      ProductTranslationDomainError.ERRORS.MISSING_LANGUAGE_CODE,
    );
  }
  static missingName(): ProductTranslationDomainError {
    return new ProductTranslationDomainError(
      'Name is required',
      ProductTranslationDomainError.ERRORS.MISSING_NAME,
    );
  }
  static missingDescription(): ProductTranslationDomainError {
    return new ProductTranslationDomainError(
      'Description is required',
      ProductTranslationDomainError.ERRORS.MISSING_DESCRIPTION,
    );
  }
  static missingId(): ProductTranslationDomainError {
    return new ProductTranslationDomainError(
      'Id is required',
      ProductTranslationDomainError.ERRORS.MISSING_ID,
    );
  }
  static missingProductId(): ProductTranslationDomainError {
    return new ProductTranslationDomainError(
      'Product id is required',
      ProductTranslationDomainError.ERRORS.MISSING_PRODUCT_ID,
    );
  }
}
