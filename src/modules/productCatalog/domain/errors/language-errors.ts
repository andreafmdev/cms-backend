import { DomainError } from '@shared/domain/errors/domain-error';

export class LanguageDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_CODE: 'MISSING_CODE',
    MISSING_NAME: 'MISSING_NAME',
  } as const;

  constructor(
    message: string,
    public readonly code: keyof typeof LanguageDomainError.ERRORS,
  ) {
    super(message);
  }

  static missingCode(): LanguageDomainError {
    return new LanguageDomainError(
      'The code is required.',
      LanguageDomainError.ERRORS.MISSING_CODE,
    );
  }
  static missingName(): LanguageDomainError {
    return new LanguageDomainError(
      'The name is required.',
      LanguageDomainError.ERRORS.MISSING_NAME,
    );
  }
}
