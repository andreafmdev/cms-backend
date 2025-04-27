import { DomainError } from '@shared/domain/errors/domain-error';

export class ProductCategoryAttributeValueDomainError extends DomainError {
  static readonly ERRORS = {
    MISSING_VALUE: 'MISSING_VALUE',
    MISSING_ATTRIBUTE_ID: 'MISSING_ATTRIBUTE_ID',
    MISSING_PRODUCT_ID: 'MISSING_PRODUCT_ID',
  } as const;
  constructor(
    message: string,
    public readonly code: keyof typeof ProductCategoryAttributeValueDomainError.ERRORS,
  ) {
    super(message);
  }
  static missingValue(): ProductCategoryAttributeValueDomainError {
    return new ProductCategoryAttributeValueDomainError(
      'Value is required',
      ProductCategoryAttributeValueDomainError.ERRORS.MISSING_VALUE,
    );
  }
  static missingAttributeId(): ProductCategoryAttributeValueDomainError {
    return new ProductCategoryAttributeValueDomainError(
      'Attribute ID is required',
      ProductCategoryAttributeValueDomainError.ERRORS.MISSING_ATTRIBUTE_ID,
    );
  }
  static missingProductId(): ProductCategoryAttributeValueDomainError {
    return new ProductCategoryAttributeValueDomainError(
      'Product ID is required',
      ProductCategoryAttributeValueDomainError.ERRORS.MISSING_PRODUCT_ID,
    );
  }
}
