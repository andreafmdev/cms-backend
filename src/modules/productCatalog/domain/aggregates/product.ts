import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { ProductId } from '../value-objects/product-id';
import { ProductTranslation } from '../entities/product-translation';
import { ProductImage } from '../entities/product-image';
import { LanguageCode } from '../value-objects/language-code';
import { ProductDomainError } from '../errors/product-errors';
import { CategoryId } from '../value-objects/category-id';
import { ProductCategoryAttributeValue } from '../entities/product-category-attribute-value';
import { ProductCategoryAttributeId } from '../value-objects/product-category-attribute-id';
import { BrandId } from '../value-objects/brand-id';

//#region INTERFACES
export interface ProductProps {
  translations: ProductTranslation[];
  price: number;
  isAvailable: boolean;
  isFeatured: boolean;
  image: ProductImage[];
  brandId: BrandId;
  categoryId: CategoryId;
  attributesValues: ProductCategoryAttributeValue[];
}

export interface CreateProductProps
  extends Omit<ProductProps, 'isAvailable' | 'isFeatured'> {
  isAvailable?: boolean;
  isFeatured?: boolean;
  id: ProductId;
}

export type UpdateProductProps = Partial<ProductProps>;

export interface ReconstituteProps extends ProductProps {
  id: ProductId;
}
//#endregion INTERFACES
export class Product extends AggregateRoot<ProductId> {
  //#region PROPERTIES
  private price: number;
  private isAvailable: boolean;
  private isFeatured: boolean;
  private image: ProductImage[];
  private brandId: BrandId;
  private categoryId: CategoryId;
  private translations: ProductTranslation[];
  private attributesValues: ProductCategoryAttributeValue[];
  private static readonly DEFAULT_IS_AVAILABLE = true;
  private static readonly DEFAULT_IS_FEATURED = false;
  private static readonly DEFAULT_LANGUAGE_CODE =
    process.env.DEFAULT_LANGUAGE_CODE;
  private static readonly MIN_PRICE = 0;
  //#endregion PROPERTIES

  //#region ATOMIC VALIDATORS
  private static validatePriceValue(price: number): void {
    if (price === null || price === undefined || price <= Product.MIN_PRICE) {
      throw ProductDomainError.invalidPrice(price ?? 0);
    }
  }

  private static validateCategoryValue(categoryId: CategoryId): void {
    if (!categoryId) {
      throw ProductDomainError.missingCategory();
    }
  }

  private static validateBrandValue(brandId: BrandId): void {
    if (!brandId) {
      throw ProductDomainError.missingBrand();
    }
  }

  private static validateAttributeValueString(value: string): void {
    if (!value) {
      throw ProductDomainError.invalidAttributeValue(value);
    }
  }

  private static validateTranslationsArray(
    translations: ProductTranslation[],
  ): void {
    if (!translations || translations.length === 0) {
      throw ProductDomainError.noTranslations();
    }

    const languageCodes = new Set<string>();
    for (const translation of translations) {
      const code = translation.getLanguageCode().getValue();
      if (languageCodes.has(code)) {
        throw ProductDomainError.duplicateTranslation(
          LanguageCode.create(code),
        );
      }
      languageCodes.add(code);
    }
  }
  //#endregion

  //#region ORCHESTRATION
  private static validateForCreation(props: CreateProductProps): void {
    this.validatePriceValue(props.price);
    this.validateCategoryValue(props.categoryId);
    this.validateBrandValue(props.brandId);
    this.validateTranslationsArray(props.translations);
  }

  private static validateForUpdate(props: UpdateProductProps): void {
    if ('price' in props && props.price !== undefined) {
      this.validatePriceValue(props.price);
    }

    if ('categoryId' in props && props.categoryId !== undefined) {
      this.validateCategoryValue(props.categoryId);
    }

    if ('brandId' in props && props.brandId !== undefined) {
      this.validateBrandValue(props.brandId);
    }

    if ('translations' in props && props.translations !== undefined) {
      this.validateTranslationsArray(props.translations);
    }
  }

  private static validatePriceUpdate(price: number): void {
    this.validatePriceValue(price);
  }

  private static validateAttributeUpdate(value: string): void {
    this.validateAttributeValueString(value);
  }
  //#endregion

  //#region CONSTRUCTOR
  private constructor(
    price: number,
    isAvailable: boolean,
    isFeatured: boolean,
    image: ProductImage[],
    translations: ProductTranslation[],
    attributesValues: ProductCategoryAttributeValue[],
    brandId: BrandId,
    categoryId: CategoryId,
    id: ProductId,
  ) {
    super(id);
    Product.validateForCreation({
      price,
      isAvailable,
      isFeatured,
      image,
      brandId,
      categoryId,
      translations,
      attributesValues,
      id,
    });

    this.price = price;
    this.isAvailable = isAvailable;
    this.image = image;
    this.brandId = brandId;
    this.translations = translations;
    this.attributesValues = attributesValues;
    this.categoryId = categoryId;
    this.isFeatured = isFeatured;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS

  /**
   * Creates a new product
   * @param props - The properties of the product
   * @param props.price - The price of the product
   * @param props.isAvailable - The availability of the product
   * @param props.image - The image of the product
   * @param props.brandId - The brand ID of the product
   * @param props.categoryId - The category ID of the product
   * @param props.translations - The translations of the product
   * @param props.attributesValues - The attributes values of the product
   * @param props.id - The ID of the product
   * @returns A new product
   */
  static create(props: CreateProductProps): Product {
    const product = new Product(
      props.price,
      props.isAvailable ?? Product.DEFAULT_IS_AVAILABLE,
      props.isFeatured ?? Product.DEFAULT_IS_FEATURED,
      props.image,
      props.translations,
      props.attributesValues,
      props.brandId,
      props.categoryId,
      props.id,
    );
    //product.addDomainEvent(new ProductCreatedEvent(product));

    return product;
  }

  /**
   * Reconstitutes a product from its properties
   * @param id - The ID of the product
   * @param price - The price of the product
   * @param isAvailable - The availability of the product
   * @param image - The image of the product
   * @param brandId - The brand ID of the product
   * @param categoryId - The category ID of the product
   * @param translations - The translations of the product
   * @returns A new product
   */
  static reconstitute(props: ReconstituteProps): Product {
    return new Product(
      props.price,
      props.isAvailable,
      props.isFeatured,
      props.image,
      props.translations,
      props.attributesValues,
      props.brandId,
      props.categoryId,
      props.id,
    );
  }

  //#endregion FACTORY METHODS

  //#region GETTERS
  IsAvailable(): boolean {
    return this.isAvailable;
  }
  IsFeatured(): boolean {
    return this.isFeatured;
  }
  getTranslations(): ProductTranslation[] {
    return this.translations;
  }
  getPrice(): number {
    return this.price;
  }

  getProductImages(): ProductImage[] {
    return this.image;
  }
  getProductImagesInOrder(): ProductImage[] {
    return this.image.sort((a, b) => a.getOrder() - b.getOrder());
  }
  getTranslation(languageCode: LanguageCode): ProductTranslation {
    return (
      this.translations.find((t) => t.getLanguageCode().equals(languageCode)) ??
      this.translations.find((t) =>
        t
          .getLanguageCode()
          .equals(LanguageCode.create(Product.DEFAULT_LANGUAGE_CODE!)),
      ) ??
      this.translations[0] // fallback to first localization
    );
  }
  hasTranslation(languageCode: LanguageCode): boolean {
    return this.translations.some((t) =>
      t.getLanguageCode().equals(languageCode),
    );
  }

  getBrandId(): BrandId {
    return this.brandId;
  }
  getCategoryId(): CategoryId {
    return this.categoryId;
  }
  getAttributesValues(): ProductCategoryAttributeValue[] {
    if (!this.attributesValues || this.attributesValues.length === 0) {
      return [];
    }
    return [...this.attributesValues];
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS
  update(props: UpdateProductProps): void {
    Product.validateForUpdate(props);

    if (props.price !== undefined) this.price = props.price;
    if (props.isAvailable !== undefined) this.isAvailable = props.isAvailable;
    if (props.isFeatured !== undefined) this.isFeatured = props.isFeatured;
    if (props.image !== undefined) this.image = props.image;
    if (props.translations !== undefined)
      this.translations = props.translations;
    if (props.attributesValues !== undefined)
      this.attributesValues = props.attributesValues;
    if (props.brandId !== undefined) this.brandId = props.brandId;
    if (props.categoryId !== undefined) this.categoryId = props.categoryId;
  }

  updatePrice(price: number): void {
    Product.validatePriceUpdate(price);
    this.price = price;
  }

  updateIsAvailable(isAvailable: boolean): void {
    this.update({ isAvailable });
  }

  /**
   * Add an attribute
   * @param value - The value of the attribute
   * @param attributeId - The ID of the attribute
   * @returns The updated product
   */
  addAttribute(value: string, attributeId: ProductCategoryAttributeId): void {
    const existingValue = this.findAttribute(attributeId);

    const newValue = ProductCategoryAttributeValue.create({
      value,
      attributeId,
      productId: this.getId(),
    });

    if (existingValue) {
      const index = this.attributesValues.findIndex((attr) =>
        attr.hasAttributeId(attributeId),
      );
      this.attributesValues[index] = newValue;
    } else {
      this.attributesValues.push(newValue);
    }
  }

  /**
   * Remove an attribute
   * @param attributeId - The ID of the attribute
   * @returns The updated product
   */
  removeAttribute(attributeId: ProductCategoryAttributeId): void {
    this.attributesValues = this.attributesValues.filter(
      (attr) => !attr.hasAttributeId(attributeId),
    );
  }

  /**
   * Update an attribute
   * @param attributeId - The ID of the attribute
   * @param newValue - The new value of the attribute
   * @returns The updated product
   */
  updateAttribute(
    attributeId: ProductCategoryAttributeId,
    newValue: string,
  ): void {
    Product.validateAttributeUpdate(newValue);

    if (!this.hasAttribute(attributeId)) {
      this.addAttribute(newValue, attributeId);
      return;
    }

    const index = this.attributesValues.findIndex((attr) =>
      attr.hasAttributeId(attributeId),
    );
    this.attributesValues[index] =
      this.attributesValues[index].updateValue(newValue);
  }

  /**
   * Find an attribute by its ID
   * @param attributeId - The ID of the attribute
   * @returns The attribute if found, otherwise undefined
   */
  findAttribute(
    attributeId: ProductCategoryAttributeId,
  ): ProductCategoryAttributeValue | undefined {
    return this.attributesValues.find((attr) =>
      attr.hasAttributeId(attributeId),
    );
  }

  /**
   * Check if the product has an attribute by its ID
   * @param attributeId - The ID of the attribute
   * @returns True if the product has the attribute, otherwise false
   */
  hasAttribute(attributeId: ProductCategoryAttributeId): boolean {
    return this.findAttribute(attributeId) !== undefined;
  }

  addTranslation(translation: ProductTranslation): void {
    if (this.hasTranslation(translation.getLanguageCode())) {
      throw ProductDomainError.duplicateTranslation(
        translation.getLanguageCode(),
      );
    }
    this.translations.push(translation);
  }

  /**
   * Remove a translation
   * @param languageCode - The language code of the translation
   * @returns The updated product
   */
  removeTranslation(languageCode: LanguageCode): void {
    const index = this.translations.findIndex((t) =>
      t.getLanguageCode().equals(languageCode),
    );

    if (index !== -1) {
      this.translations.splice(index, 1);
    } else {
      throw ProductDomainError.translationNotFound(languageCode);
    }
  }

  /**
   * Add an image to the product
   * @param image - The image to add
   * @returns The updated product
   */
  addImage(image: ProductImage): void {
    this.image.push(image);
  }

  /**
   * Remove an image from the product
   * @param image - The image to remove
   * @returns The updated product
   */
  removeImage(image: ProductImage): void {
    const index = this.image.indexOf(image);
    if (index !== -1) {
      this.image.splice(index, 1);
    }
  }

  /**
   * Restituisce le immagini ordinate con opzioni avanzate
   * @param mainFirst - Se mettere l'immagine principale per prima
   * @returns Array di ProductImage ordinate
   */
  getProductImagesOrdered(mainFirst: boolean = true): ProductImage[] {
    if (!mainFirst) {
      return this.getProductImagesInOrder();
    }

    return this.image.sort((a, b) => {
      if (a.getIsMain() && !b.getIsMain()) return -1;
      if (!a.getIsMain() && b.getIsMain()) return 1;
      return a.getOrder() - b.getOrder();
    });
  }
  //#endregion BUSINESS METHODS
}
