import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { ProductId } from '../value-objects/product-id';
import { ProductTranslation } from '../entities/product-translation';
import { Brand } from '../entities/brand';
import { Category } from '../entities/category';
import { ProductAttribute } from '../entities/product-attribute';
const DEFAULT_LANGUAGE_CODE = 'it';

export class Product extends AggregateRoot {
  private price: number;
  private isAvailable: boolean;
  private image: string;
  private stock: number;
  private brand?: Brand;
  private productCategory?: Category;
  private productAttributes?: ProductAttribute[];
  private localizations: ProductTranslation[];
  private constructor(
    localizations: ProductTranslation[],
    price: number,
    isAvailable: boolean,
    image: string,
    brand?: Brand,
    category?: Category,
    productAttributes?: ProductAttribute[],
    id?: ProductId,
  ) {
    super(id ?? null);
    // Validazione degli invariants
    if (localizations.length === 0) {
      throw new Error('Il prodotto deve avere almeno una traduzione.');
    }
    if (price <= 0) {
      throw new Error('Il prezzo deve essere maggiore di zero.');
    }
    this.localizations = localizations;
    this.price = price;
    this.isAvailable = isAvailable;
    this.image = image;
    this.brand = brand;
    this.productCategory = category;
    this.productAttributes = productAttributes ?? [];
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
    isAvailable?: boolean;
    image: string;
    brand?: Brand;
    category?: Category;
    productAttributes?: ProductAttribute[];
  }): Product {
    const product = new Product(
      props.translations,
      props.price,
      props.isAvailable ?? true,
      props.image,
      props.brand,
      props.category,
      props.productAttributes,
      /* id non passato per una nuova creazione */
    );
    // (Opzionale) Aggiungere l'evento di dominio per la creazione del prodotto

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
  assignDatabaseId(id: number): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.assignId(ProductId.create(id));
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
  static reconstitute(props: {
    id: number;
    translations: ProductTranslation[];
    price: number;
    isAvailable: boolean;
    image: string;
    brand?: Brand;
    category?: Category;
    productAttributes?: ProductAttribute[];
  }): Product {
    return new Product(
      props.translations,
      props.price,
      props.isAvailable,
      props.image,
      props.brand,
      props.category,
      props.productAttributes,
      ProductId.create(props.id),
    );
  }
  //#endregion
}
