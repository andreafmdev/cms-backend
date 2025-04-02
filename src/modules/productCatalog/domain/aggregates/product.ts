import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { ProductId } from '../value-objects/product-id';
import { ProductTranslation } from '../entities/product-translation';
import { BrandId } from '../value-objects/brand-id';
const DEFAULT_LANGUAGE_CODE = 'it';

export class Product extends AggregateRoot {
  private price: number;
  private isAvailable: boolean;
  private image: string;
  private stock: number;
  private localizations: ProductTranslation[];
  private brandId?: BrandId;
  private constructor(
    id: ProductId,
    localizations: ProductTranslation[],
    price: number,
    isAvailable: boolean,
    brandId?: BrandId,
  ) {
    super(id);
    this.localizations = localizations;
    this.price = price;
    this.isAvailable = isAvailable;
    this.brandId = brandId;
  }
  //#region BUSINESS LOGIC

  /**
   * Creates a new product
   * @param props - The properties of the product
   * @returns A new product
   */
  static create(props: {
    translations: ProductTranslation[];
    price: number;
    isAvailable: boolean;
    brandId?: BrandId;
  }): Product {
    const productId: ProductId = ProductId.create();
    const product = new Product(
      productId,
      props.translations,
      props.price,
      props.isAvailable ?? true,
      props.brandId,
    );
    return product;
  }

  //#region GETTERS
  getLocalizations(): ProductTranslation[] {
    return this.localizations;
  }
  getPrice(): number {
    return this.price;
  }
  getIsAvailable(): boolean {
    return this.isAvailable;
  }
  getTranslation(languageCode: string): ProductTranslation {
    return (
      this.localizations.find((t) => t.getLanguageCode() === languageCode) ??
      this.localizations.find(
        (t) => t.getLanguageCode() === DEFAULT_LANGUAGE_CODE,
      ) ??
      this.localizations[0] // fallback totale
    );
  }

  //#endregion  GETTERS

  //#endregion

  //#region SETTERS

  //#endregion

  //#region RECONSITUTE
  /**
   * Reconstitutes a product from its properties
   * @param id - The ID of the product
   * @param name - The name of the product
   * @param description - The description of the product
   * @returns A new product
   */
  static reconstitute(
    id: ProductId,
    localizations: ProductTranslation[],
    price: number,
    isAvailable: boolean,
    brandId?: BrandId,
  ): Product {
    const product = new Product(id, localizations, price, isAvailable, brandId);
    return product;
  }
  //#endregion
}
