import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { LanguageCode } from '../value-objects/language-code';
import { ProductCategoryAttributeTranslationDomainError } from '../errors/product-category-attribute-translation-errors';
import { ProductCategoryAttributeId } from '../value-objects/product-category-attribute-id';

//#region INTERFACES
interface ProductCategoryAttributeTranslationProps {
  value: string;
  languageCode: LanguageCode;
  attributeId?: ProductCategoryAttributeId;
}

type CreateProductCategoryAttributeTranslationProps =
  ProductCategoryAttributeTranslationProps;

type UpdateProductCategoryAttributeTranslationProps =
  Partial<ProductCategoryAttributeTranslationProps>;

type ReconstituteProps = ProductCategoryAttributeTranslationProps;
//#endregion INTERFACES

export class ProductCategoryAttributeTranslation {
  //#region PROPERTIES
  private readonly value: string;
  private readonly languageCode: LanguageCode;
  private readonly attributeId?: ProductCategoryAttributeId;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(
    value: string,
    languageCode: LanguageCode,
    attributeId?: ProductCategoryAttributeId,
  ) {
    ProductCategoryAttributeTranslation.validateInvariants({
      value,
      languageCode,
    });
    this.value = value;
    this.languageCode = languageCode;
    this.attributeId = attributeId;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Create a new product attribute translation
   * @param props - The properties of the product attribute translation
   * @param props.value - The value of the product attribute translation
   * @param props.languageCode - The language code of the product attribute translation
   * @param props.attributeId - The ID of the attribute
   * @returns The new product attribute translation
   */
  static create(
    props: CreateProductCategoryAttributeTranslationProps,
  ): ProductCategoryAttributeTranslation {
    return new ProductCategoryAttributeTranslation(
      props.value,
      props.languageCode,
      props.attributeId,
    );
  }
  /**
   * Reconstitute a product attribute translation
   * @param props - The properties of the product attribute translation
   * @param props.value - The value of the product attribute translation
   * @param props.languageCode - The language code of the product attribute translation
   * @param props.attributeId - The ID of the attribute
   * @returns The reconstituted product attribute translation
   */
  static reconstitute(
    props: ReconstituteProps,
  ): ProductCategoryAttributeTranslation {
    return new ProductCategoryAttributeTranslation(
      props.value,
      props.languageCode,
      props.attributeId,
    );
  }
  //#endregion FACTORY METHODS

  //#region VALIDATION

  private static validateInvariants(
    props: Partial<ProductCategoryAttributeTranslationProps>,
  ): void {
    if (BaseDomainEntity.isNullOrUndefined(props.value)) {
      throw ProductCategoryAttributeTranslationDomainError.missingValue();
    }
  }
  //#endregion VALIDATION

  //#region GETTERS
  /**
   * Get the ID of the attribute
   * @returns The ID of the attribute
   */
  getAttributeId(): ProductCategoryAttributeId {
    return this.attributeId!;
  }
  /**
   * Get the value of the product attribute translation
   * @returns The value of the product attribute translation
   */
  getValue(): string {
    return this.value;
  }
  /**
   * Check if the attribute is assigned to a product
   * @returns True if the attribute is assigned to a product, false otherwise
   */
  isAssigned(): boolean {
    return this.attributeId !== undefined;
  }
  /**
   * Get the language code of the product attribute translation
   * @returns The language code of the product attribute translation
   */
  getLanguageCode(): LanguageCode {
    return this.languageCode;
  }
  /**
   * Check if the attribute belongs to the product
   * @param attributeId - The ID of the attribute
   * @returns True if the attribute belongs to the product, false otherwise
   */
  belongsToAttribute(attributeId: ProductCategoryAttributeId): boolean {
    return this.attributeId?.equals(attributeId) ?? false;
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  update(
    props: UpdateProductCategoryAttributeTranslationProps,
  ): ProductCategoryAttributeTranslation {
    const updatedProps = {
      value: props.value ?? this.value,
      languageCode: props.languageCode ?? this.languageCode,
      attributeId: props.attributeId ?? this.attributeId,
    };

    return new ProductCategoryAttributeTranslation(
      updatedProps.value,
      updatedProps.languageCode,
      updatedProps.attributeId,
    );
  }
  updateValueByLanguageCode(
    languageCode: LanguageCode,
    value: string,
  ): ProductCategoryAttributeTranslation {
    return this.update({ value, languageCode });
  }
  updateValue(value: string): ProductCategoryAttributeTranslation {
    return this.update({ value });
  }

  updateLanguageCode(
    languageCode: LanguageCode,
  ): ProductCategoryAttributeTranslation {
    return this.update({ languageCode });
  }
  /**
   * Check if the translation is equal to another translation
   * @param other - The other translation to compare to
   * @returns True if the translation is equal to the other translation, false otherwise
   */
  equals(other: ProductCategoryAttributeTranslation): boolean {
    return this.languageCode.equals(other.languageCode);
  }

  addTranslation(
    languageCode: LanguageCode,
    value: string,
  ): ProductCategoryAttributeTranslation {
    return this.update({ languageCode, value });
  }

  removeTranslation(
    languageCode: LanguageCode,
  ): ProductCategoryAttributeTranslation {
    return this.update({ languageCode: languageCode });
  }

  //#endregion BUSINESS METHODS
}
