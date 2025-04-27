import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { ProductCategoryAttributeId } from '../value-objects/product-category-attribute-id';
import { ProductCategoryAttributeValueDomainError } from '../errors/product-category-attribute-value-errors';
import { ProductId } from '../value-objects/product-id';

//#region INTERFACES
interface ProductCategoryAttributeValueProps {
  value: string;
  attributeId: ProductCategoryAttributeId;
  productId: ProductId;
}

type CreateProductCategoryAttributeValueProps =
  ProductCategoryAttributeValueProps;

type UpdateProductCategoryAttributeValueProps =
  Partial<ProductCategoryAttributeValueProps>;

type ReconstituteProps = ProductCategoryAttributeValueProps;
//#endregion INTERFACES

/**
 * Represents a product category attribute value
 */
export class ProductCategoryAttributeValue {
  //#region PROPERTIES
  private readonly value: string;
  private readonly attributeId: ProductCategoryAttributeId;
  private readonly productId: ProductId;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  /**
   * Creates a new product category attribute value
   * @param value - The value of the attribute
   * @param attributeId - The ID of the category attribute
   * @param id - The ID of the product category attribute value
   */
  private constructor(
    value: string,
    attributeId: ProductCategoryAttributeId,
    productId: ProductId,
  ) {
    ProductCategoryAttributeValue.validateInvariants({
      value,
      attributeId,
      productId,
    });
    this.value = value;
    this.attributeId = attributeId;
    this.productId = productId;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Creates a new product category attribute value
   * @param props - The properties of the product category attribute value
   * @param props.value - The value of the attribute
   * @param props.attributeId - The ID of the category attribute
   * @param props.productId - The ID of the product
   * @returns A new product category attribute value
   */
  static create(
    props: CreateProductCategoryAttributeValueProps,
  ): ProductCategoryAttributeValue {
    return new ProductCategoryAttributeValue(
      props.value,
      props.attributeId,
      props.productId,
    );
  }
  /**
   * Reconstitutes a product category attribute value
   * @param props - The properties of the product category attribute value
   * @param props.value - The value of the attribute
   * @param props.attributeId - The ID of the category attribute
   * @param props.productId - The ID of the product
   * @returns A new product category attribute value
   */
  static reconstitute(props: ReconstituteProps): ProductCategoryAttributeValue {
    return new ProductCategoryAttributeValue(
      props.value,
      props.attributeId,
      props.productId,
    );
  }
  //#endregion FACTORY METHODS

  //#region VALIDATION
  /**
   * Validates the invariants of the product category attribute value
   * @param props - The properties of the product category attribute value
   * @param props.value - The value of the attribute
   * @param props.attributeId - The ID of the category attribute
   * @param props.productId - The ID of the product
   */
  private static validateInvariants(
    props: Partial<ProductCategoryAttributeValueProps>,
  ): void {
    if (
      BaseDomainEntity.isNullOrUndefined(props.value) ||
      props.value.trim() === ''
    ) {
      throw ProductCategoryAttributeValueDomainError.missingValue();
    }
    if (BaseDomainEntity.isNullOrUndefined(props.attributeId)) {
      throw ProductCategoryAttributeValueDomainError.missingAttributeId();
    }
    if (BaseDomainEntity.isNullOrUndefined(props.productId)) {
      throw ProductCategoryAttributeValueDomainError.missingProductId();
    }
  }
  //#endregion VALIDATION

  //#region GETTERS
  /**
   * Gets the value of the product category attribute
   * @returns The value of the product category attribute
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Gets the attribute ID of the product category attribute
   * @returns The attribute ID of the product category attribute
   */
  getAttributeId(): ProductCategoryAttributeId {
    return this.attributeId;
  }
  /**
   * Gets the product ID of the product category attribute value
   * @returns The product ID of the product category attribute value
   */
  getProductId(): ProductId {
    return this.productId;
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  /**
   * Updates the product category attribute value
   * @param props - The properties of the product category attribute value
   * @param props.value - The value of the attribute
   * @param props.attributeId - The ID of the category attribute
   * @returns A new product category attribute value
   */
  update(
    props: UpdateProductCategoryAttributeValueProps,
  ): ProductCategoryAttributeValue {
    return new ProductCategoryAttributeValue(
      props.value ?? this.value,
      props.attributeId ?? this.attributeId,
      props.productId ?? this.productId,
    );
  }
  /**
   * Checks if the attribute ID is equal to the given attribute ID
   * @param attributeId - The attribute ID to check
   * @returns True if the attribute ID is equal to the given attribute ID, false otherwise
   */
  hasAttributeId(attributeId: ProductCategoryAttributeId): boolean {
    return this.attributeId.equals(attributeId);
  }
  /**
   * Updates the value of the product category attribute
   * @param value - The value of the attribute
   * @returns A new product category attribute value
   */
  updateValue(value: string): ProductCategoryAttributeValue {
    return this.update({ value });
  }
  /**
   * Updates the attribute ID of the product category attribute
   * @param attributeId - The attribute ID to update
   * @returns A new product category attribute value
   */
  updateAttributeId(
    attributeId: ProductCategoryAttributeId,
  ): ProductCategoryAttributeValue {
    return this.update({ attributeId });
  }

  //#endregion BUSINESS METHODS
}
