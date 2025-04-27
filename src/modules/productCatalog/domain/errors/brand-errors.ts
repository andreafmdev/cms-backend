import { DomainError } from '@shared/domain/errors/domain-error';

export class BrandDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_NAME: 'MISSING_NAME',
  } as const;

  constructor(
    message: string,
    public readonly code: keyof typeof BrandDomainError.ERRORS,
  ) {
    super(message);
  }

  static missingName(): BrandDomainError {
    return new BrandDomainError(
      'The name is required.',
      BrandDomainError.ERRORS.MISSING_NAME,
    );
  }
}
