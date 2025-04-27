import { DomainError } from '@shared/domain/errors/domain-error';

export class ProductImageDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_URL: 'MISSING_URL',
    INVALID_URL: 'INVALID_URL',
  } as const;

  constructor(
    message: string,
    public readonly code: keyof typeof ProductImageDomainError.ERRORS,
  ) {
    super(message);
  }

  static missingUrl(): ProductImageDomainError {
    return new ProductImageDomainError(
      'Url is required',
      ProductImageDomainError.ERRORS.MISSING_URL,
    );
  }

  static invalidUrl(): ProductImageDomainError {
    return new ProductImageDomainError(
      'Invalid url',
      ProductImageDomainError.ERRORS.INVALID_URL,
    );
  }
}
