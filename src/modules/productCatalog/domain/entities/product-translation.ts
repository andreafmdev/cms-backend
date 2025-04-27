import { LanguageCode } from '../value-objects/language-code';
import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { ProductTranslationDomainError } from '../errors/product-translation-errors';
import { ProductId } from '../value-objects/product-id';

//#region INTERFACES
interface ProductTranslationProps {
  languageCode: LanguageCode;
  name: string;
  description: string;
  productId: ProductId;
}

type CreateProductTranslationProps = ProductTranslationProps;

type UpdateProductTranslationProps = Partial<ProductTranslationProps>;

type ReconstituteProps = ProductTranslationProps;
//#endregion INTERFACES

export class ProductTranslation {
  //#region PROPERTIES
  private readonly languageCode: LanguageCode;
  private readonly name: string;
  private readonly description: string;
  private readonly productId: ProductId;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  /**
   * Create a new product translation
   * @param languageCode - The language code of the product translation
   * @param name - The name of the product translation
   * @param description - The description of the product translation
   * @param productId - The id of the product
   */
  private constructor(
    languageCode: LanguageCode,
    name: string,
    description: string,
    productId: ProductId,
  ) {
    ProductTranslation.validateInvariants({
      languageCode,
      name,
      description,
      productId,
    });
    this.languageCode = languageCode;
    this.name = name;
    this.description = description;
    this.productId = productId;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Create a new product translation
   * @param props - The properties of the product translation
   * @param props.languageCode - The language code of the product translation
   * @param props.name - The name of the product translation
   * @param props.description - The description of the product translation
   * @param props.productId - The id of the product
   * @returns The created product translation
   */
  static create(props: CreateProductTranslationProps): ProductTranslation {
    return new ProductTranslation(
      props.languageCode,
      props.name,
      props.description,
      props.productId,
    );
  }

  /**
   * Reconstitute a product translation
   * @param props - The properties of the product translation
   * @returns The reconstituted product translation
   */
  static reconstitute(props: ReconstituteProps): ProductTranslation {
    return new ProductTranslation(
      props.languageCode,
      props.name,
      props.description,
      props.productId,
    );
  }
  //#endregion FACTORY METHODS

  //#region VALIDATION
  private static validateInvariants(
    props: Partial<ProductTranslationProps>,
  ): void {
    if (
      BaseDomainEntity.isNullOrUndefined(props.name) ||
      props.name.trim() === ''
    ) {
      throw ProductTranslationDomainError.missingName();
    }
    if (
      BaseDomainEntity.isNullOrUndefined(props.description) ||
      props.description.trim() === ''
    ) {
      throw ProductTranslationDomainError.missingDescription();
    }
    if (BaseDomainEntity.isNullOrUndefined(props.languageCode)) {
      throw ProductTranslationDomainError.missingLanguageCode();
    }
    if (BaseDomainEntity.isNullOrUndefined(props.productId)) {
      throw ProductTranslationDomainError.missingProductId();
    }
  }
  //#endregion VALIDATION

  //#region GETTERS
  getLanguageCode(): LanguageCode {
    return this.languageCode;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getProductId(): ProductId {
    return this.productId;
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  update(props: UpdateProductTranslationProps): ProductTranslation {
    return new ProductTranslation(
      props.languageCode ?? this.languageCode,
      props.name ?? this.name,
      props.description ?? this.description,
      props.productId ?? this.productId,
    );
  }

  updateName(name: string): ProductTranslation {
    return this.update({ name });
  }

  updateDescription(description: string): ProductTranslation {
    return this.update({ description });
  }

  updateLanguageCode(languageCode: LanguageCode): ProductTranslation {
    return this.update({ languageCode });
  }
  //#endregion BUSINESS METHODS
}
