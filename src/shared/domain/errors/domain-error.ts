export abstract class DomainError extends Error {
  constructor(
    message: string,
    public readonly category?: ErrorCategory,
    public readonly code?: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  BUSINESS_RULE = 'BUSINESS_RULE',
  SYSTEM = 'SYSTEM',
}
