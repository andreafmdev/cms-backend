import { DomainError } from '@shared/domain/errors/domain-error';

export class LanguageCodeDomainError extends DomainError {
  static readonly ERRORS = {
    UNSUPPORTED_LANGUAGE_CODE: 'UNSUPPORTED_LANGUAGE_CODE',
    MISSING_VALUE: 'MISSING_VALUE',
    INVALID_VALUE: 'INVALID_VALUE',
  } as const;

  constructor(
    message: string,
    public readonly code: keyof typeof LanguageCodeDomainError.ERRORS,
  ) {
    super(message);
  }

  static unsupportedLanguageCode(): LanguageCodeDomainError {
    return new LanguageCodeDomainError(
      `Unsupported language code`,
      LanguageCodeDomainError.ERRORS.UNSUPPORTED_LANGUAGE_CODE,
    );
  }
  static missingValue(): LanguageCodeDomainError {
    return new LanguageCodeDomainError(
      `Language code is required`,
      LanguageCodeDomainError.ERRORS.MISSING_VALUE,
    );
  }
  static invalidValue(): LanguageCodeDomainError {
    return new LanguageCodeDomainError(
      `Language code must be 2 characters long`,
      LanguageCodeDomainError.ERRORS.INVALID_VALUE,
    );
  }
}
