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
  image: ProductImage[];
  brandId: BrandId;
  categoryId: CategoryId;
  attributesValues: ProductCategoryAttributeValue[];
}

export interface CreateProductProps extends Omit<ProductProps, 'isAvailable'> {
  isAvailable?: boolean;
  id: ProductId;
}

export type UpdateProductProps = Partial<ProductProps>;

export interface ReconstituteProps extends ProductProps {
  id: ProductId;
}
//#endregion INTERFACES
export class Product extends AggregateRoot<ProductId> {
  //#region PROPERTIES
  private readonly price: number;
  private readonly isAvailable: boolean;
  private readonly image: ProductImage[];
  private readonly brandId: BrandId;
  private readonly categoryId: CategoryId;
  private readonly translations: ProductTranslation[];
  private readonly attributesValues: ProductCategoryAttributeValue[];
  private static readonly DEFAULT_IS_AVAILABLE = true;
  private static readonly DEFAULT_LANGUAGE_CODE = 'it';
  private static readonly MIN_PRICE = 0;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(
    price: number,
    isAvailable: boolean,
    image: ProductImage[],
    translations: ProductTranslation[],
    attributesValues: ProductCategoryAttributeValue[],
    brandId: BrandId,
    categoryId: CategoryId,
    id: ProductId,
  ) {
    super(id);
    Product.validateInvariants({
      price,
      isAvailable,
      image,
      brandId,
      categoryId,
      translations,
      attributesValues,
    });

    this.price = price;
    this.isAvailable = isAvailable;
    this.image = image;
    this.brandId = brandId;
    this.translations = translations;
    this.attributesValues = attributesValues;
    this.categoryId = categoryId;
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
   * @param props.attributes - The attributes of the product
   * @param props.id - The ID of the product
   * @returns A new product
   */
  static create(props: CreateProductProps): Product {
    const product = new Product(
      props.price,
      props.isAvailable ?? Product.DEFAULT_IS_AVAILABLE,
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
      props.image,
      props.translations,
      props.attributesValues,
      props.brandId,
      props.categoryId,
      props.id,
    );
  }

  //#endregion FACTORY METHODS

  //#region VALIDATION

  ///#region UPDATE VALIDATION
  private static validatePriceUpdate(props: UpdateProductProps): void {
    if (!('price' in props)) return;

    if (
      props.price === null ||
      props.price === undefined ||
      props.price <= Product.MIN_PRICE
    ) {
      throw ProductDomainError.invalidPrice(props.price ?? 0);
    }
  }

  private static validateCategoryUpdate(props: UpdateProductProps): void {
    if (!('categoryId' in props)) return;

    if (!props.categoryId) {
      throw ProductDomainError.missingCategory();
    }
  }
  private static validateBrandUpdate(props: UpdateProductProps): void {
    if (!('brandId' in props)) return;

    if (!props.brandId) {
      throw ProductDomainError.missingBrand();
    }
  }

  private static validateAttributeValue(newValue: string): void {
    if (!newValue) {
      throw ProductDomainError.invalidAttributeValue(newValue);
    }
  }
  private static validateTranslationsUpdate(props: UpdateProductProps): void {
    if (!('translations' in props)) return;

    if (!props.translations?.length) {
      throw ProductDomainError.noTranslations();
    }
  }
  private static validateTranslations(props: UpdateProductProps): void {
    if (!props.translations) return;

    // Check if translations array is empty
    if (
      this.isNullOrUndefined(props.translations) ||
      props.translations.length === 0
    ) {
      throw ProductDomainError.noTranslations();
    }

    // Check for duplicate translations
    const languageCodes = new Set<string>();
    for (const translation of props.translations) {
      const code = translation.getLanguageCode().getValue();
      if (languageCodes.has(code)) {
        throw ProductDomainError.duplicateTranslation(
          LanguageCode.create(code),
        );
      }
      languageCodes.add(code);
    }
  }
  private static validateUpdate(props: UpdateProductProps): void {
    this.validatePriceUpdate(props);
    this.validateBrandUpdate(props);
    this.validateCategoryUpdate(props);
    this.validateTranslationsUpdate(props);
  }
  //#endregion UPDATE VALIDATION

  private static validateInvariants(props: Partial<ProductProps>): void {
    if (
      this.isNullOrUndefined(props.price) ||
      props.price <= Product.MIN_PRICE
    ) {
      throw ProductDomainError.invalidPrice(props.price ?? 0);
    }
    //product translations
    Product.validateTranslations(props);
    //product category
    if (this.isNullOrUndefined(props.categoryId)) {
      throw ProductDomainError.missingCategory();
    }
  }
  //#endregion VALIDATION

  //#region GETTERS

  getTranslations(): ProductTranslation[] {
    return this.translations;
  }
  getPrice(): number {
    return this.price;
  }
  getIsAvailable(): boolean {
    return this.isAvailable;
  }
  getProductImages(): ProductImage[] {
    return this.image;
  }
  getTranslation(languageCode: LanguageCode): ProductTranslation {
    return (
      this.translations.find((t) => t.getLanguageCode().equals(languageCode)) ??
      this.translations.find((t) =>
        t
          .getLanguageCode()
          .equals(LanguageCode.create(Product.DEFAULT_LANGUAGE_CODE)),
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
  update(props: UpdateProductProps): Product {
    Product.validateUpdate(props);

    return new Product(
      props.price ?? this.price,
      props.isAvailable ?? this.isAvailable,
      props.image ?? this.image,
      props.translations ?? this.translations,
      props.attributesValues ?? this.attributesValues,
      props.brandId ?? this.brandId,
      props.categoryId ?? this.categoryId,
      this.getId(),
    );
  }

  updatePrice(price: number): Product {
    return this.update({ price });
  }

  updateIsAvailable(isAvailable: boolean): Product {
    return this.update({ isAvailable });
  }

  //#region BUSINESS METHODS
  /**
   * Add an attribute
   * @param value - The value of the attribute
   * @param attributeId - The ID of the attribute
   * @returns The updated product
   */
  addAttribute(
    value: string,
    attributeId: ProductCategoryAttributeId,
  ): Product {
    /*if (!this.hasAttribute(attributeId)) {
      throw ProductDomainError.attributeNotFound(attributeId);
    }*/
    const existingValue = this.findAttribute(attributeId);

    const newValue = ProductCategoryAttributeValue.create({
      value,
      attributeId,
      productId: this.getId(),
    });

    if (existingValue) {
      const updatedAttributes = this.attributesValues.map((attr) =>
        attr.hasAttributeId(attributeId) ? newValue : attr,
      );
      return this.update({ attributesValues: updatedAttributes });
    }

    // 5. Otherwise add new
    return this.update({
      attributesValues: [...this.attributesValues, newValue],
    });
  }
  /**
   * Remove an attribute
   * @param attributeId - The ID of the attribute
   * @returns The updated product
   */
  removeAttribute(attributeId: ProductCategoryAttributeId): Product {
    return this.update({
      attributesValues: this.attributesValues.filter(
        (attr) => !attr.hasAttributeId(attributeId),
      ),
    });
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
  ): Product {
    Product.validateAttributeValue(newValue);

    if (!this.hasAttribute(attributeId)) {
      return this.addAttribute(newValue, attributeId);
    }

    return this.update({
      attributesValues: this.attributesValues.map((attr) =>
        attr.hasAttributeId(attributeId) ? attr.updateValue(newValue) : attr,
      ),
    });
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
  addTranslation(translation: ProductTranslation): Product {
    if (this.hasTranslation(translation.getLanguageCode())) {
      throw ProductDomainError.duplicateTranslation(
        translation.getLanguageCode(),
      );
    }
    return this.update({
      translations: [...this.translations, translation],
    });
  }

  /**
   * Remove a translation
   * @param languageCode - The language code of the translation
   * @returns The updated product
   */
  removeTranslation(languageCode: LanguageCode): Product {
    if (this.hasTranslation(languageCode)) {
      return this.update({
        translations: this.translations.filter(
          (t) => !t.getLanguageCode().equals(languageCode),
        ),
      });
    } else {
      throw ProductDomainError.translationNotFound(languageCode);
    }
  }
  /**
   * Add an image to the product
   * @param image - The image to add
   * @returns The updated product
   */
  addImage(image: ProductImage): Product {
    return this.update({ image: [...this.image, image] });
  }
  /**
   * Remove an image from the product
   * @param image - The image to remove
   * @returns The updated product
   */
  removeImage(image: ProductImage): Product {
    return this.update({ image: this.image.filter((i) => i !== image) });
  }
  //#endregion BUSINESS METHODS
}
