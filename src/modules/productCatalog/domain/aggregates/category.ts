import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { CategoryDomainError } from '@module/productCatalog/domain/errors/category-errors';
import { ProductCategoryAttribute } from '../entities/product-category-attribute';
import { LanguageCode } from '../value-objects/language-code';
import { ProductCategoryAttributeId } from '../value-objects/product-category-attribute-id';

//#region INTERFACES
interface CategoryProps {
  attributes: ProductCategoryAttribute[];
  translations: CategoryTranslation[];
  id: CategoryId;
}

type CreateCategoryProps = CategoryProps;

interface ReconstituteProps extends CategoryProps {
  id: CategoryId;
}
//#endregion INTERFACES

export class Category extends AggregateRoot<CategoryId> {
  //#region PROPERTIES
  private attributes: ProductCategoryAttribute[];
  private translations: CategoryTranslation[];
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(
    attributes: ProductCategoryAttribute[],
    translations: CategoryTranslation[],
    id: CategoryId,
  ) {
    super(id);
    Category.validateInvariants({
      attributes,
      translations,
    });
    this.attributes = attributes;
    this.translations = translations;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Create a new category
   * @param props - The properties of the category
   * @returns The new category
   */
  static create(props: CreateCategoryProps): Category {
    return new Category(props.attributes, props.translations, props.id);
  }

  /**
   * Reconstitute a category from a database entity
   * @param props - The properties of the category
   * @returns The reconstituted category
   */
  static reconstitute(props: ReconstituteProps): Category {
    return new Category(props.attributes, props.translations, props.id);
  }
  //#endregion FACTORY METHODS

  //#region VALIDATION
  private static validateInvariants(props: Partial<CategoryProps>): void {
    if (
      this.isNullOrUndefined(props.translations) ||
      (Array.isArray(props.translations) && props.translations.length === 0)
    ) {
      throw CategoryDomainError.missingTranslations();
    }
    const languageCodes = new Set();
    props.translations.forEach((t) => {
      const code = t.getLanguageCode().getValue();
      if (languageCodes.has(code)) {
        throw CategoryDomainError.duplicateTranslation(code);
      }
      languageCodes.add(code);
    });
  }

  private validateTranslationInvariant(translation: CategoryTranslation): void {
    if (this.hasTranslation(translation.getLanguageCode())) {
      throw CategoryDomainError.duplicateTranslation(
        translation.getLanguageCode().getValue(),
      );
    }
  }

  private validateAttributeInvariant(
    attribute: ProductCategoryAttribute,
  ): void {
    if (!attribute.getCategoryId().equals(this.getId())) {
      throw CategoryDomainError.attributeBelongsToAnotherCategory(
        attribute.getId()?.toString() ?? '',
        this.getId()?.toString() ?? '',
      );
    }

    if (this.hasAttribute(attribute)) {
      throw CategoryDomainError.attributeAlreadyExists(
        attribute.getId()?.toString() ?? '',
      );
    }
  }
  //#endregion VALIDATION

  //#region GETTERS
  /**
   * Get all the attributes of the category
   * @returns The attributes of the category (defensive copy)
   */
  getAttributes(): ProductCategoryAttribute[] {
    return [...this.attributes];
  }

  /**
   * Check if the category has a translation in the given language
   * @param languageCode - The language code to check
   * @returns True if the category has the translation, false otherwise
   */
  hasTranslation(languageCode: LanguageCode): boolean {
    return this.translations.some((t) =>
      t.getLanguageCode().equals(languageCode),
    );
  }

  /**
   * Check if the category has an attribute
   * @param attribute - The attribute to check
   * @returns True if the category has the attribute, false otherwise
   */
  hasAttribute(attribute: ProductCategoryAttribute): boolean {
    return this.attributes.some((attr) => attr.equals(attribute));
  }

  /**
   * Check if the category has an attribute by ID
   * @param attributeId - The attribute ID to check
   * @returns True if the category has the attribute, false otherwise
   */
  hasAttributeById(attributeId: ProductCategoryAttributeId): boolean {
    return this.attributes.some((attr) => attr.getId()?.equals(attributeId));
  }

  /**
   * Find an attribute by ID
   * @param attributeId - The attribute ID to find
   * @returns The attribute if found, undefined otherwise
   */
  findAttributeById(
    attributeId: ProductCategoryAttributeId,
  ): ProductCategoryAttribute | undefined {
    return this.attributes.find((attr) => attr.getId()?.equals(attributeId));
  }

  /**
   * Get the translation of the category in the given language
   * @param languageCode - The language code to get the translation for
   * @returns The translation of the category in the given language
   */
  getTranslation(languageCode: LanguageCode): CategoryTranslation {
    const translation = this.translations.find((t) =>
      t.getLanguageCode().equals(languageCode),
    );
    if (!translation) {
      throw CategoryDomainError.translationNotFound(languageCode.getValue());
    }
    return translation;
  }

  /**
   * Get the name of the category in the given language
   * @param languageCode - The language code to get the name for
   * @returns The name of the category in the given language
   */
  getName(languageCode: LanguageCode): string {
    return this.getTranslation(languageCode).getName();
  }

  /**
   * Get the description of the category in the given language
   * @param languageCode - The language code to get the description for
   * @returns The description of the category in the given language
   */
  getDescription(languageCode: LanguageCode): string {
    return this.getTranslation(languageCode).getDescription();
  }

  /**
   * Get all the translations of the category
   * @returns The translations of the category (defensive copy)
   */
  getTranslations(): CategoryTranslation[] {
    return [...this.translations];
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS

  /**
   * Add a new attribute to the category
   * @param attribute - The attribute to add
   * @throws CategoryDomainError if the attribute already exists or belongs to another category
   */
  addAttribute(attribute: ProductCategoryAttribute): void {
    this.validateAttributeInvariant(attribute);
    this.attributes.push(attribute);
  }

  /**
   * Remove an attribute from the category
   * @param attribute - The attribute to remove
   */
  removeAttribute(attribute: ProductCategoryAttribute): void {
    const index = this.attributes.findIndex((attr) => attr.equals(attribute));
    if (index !== -1) {
      this.attributes.splice(index, 1);
    }
  }

  /**
   * Remove an attribute by ID
   * @param attributeId - The ID of the attribute to remove
   */
  removeAttributeById(attributeId: ProductCategoryAttributeId): void {
    const index = this.attributes.findIndex((attr) =>
      attr.getId()?.equals(attributeId),
    );
    if (index !== -1) {
      this.attributes.splice(index, 1);
    }
  }

  /**
   * Add a new translation to the category
   * @param translation - The translation to add
   * @throws CategoryDomainError if a translation for the language already exists
   */
  addTranslation(translation: CategoryTranslation): void {
    this.validateTranslationInvariant(translation);
    this.translations.push(translation);
  }

  /**
   * Update an existing translation
   * @param languageCode - The language code of the translation to update
   * @param name - The new name
   * @param description - The new description
   * @throws CategoryDomainError if the translation doesn't exist
   */
  updateTranslation(
    languageCode: LanguageCode,
    name: string,
    description: string,
  ): void {
    const translation = this.getTranslation(languageCode);
    translation.update({ name, description });
  }

  /**
   * Remove a translation from the category
   * @param languageCode - The language code of the translation to remove
   */
  removeTranslation(languageCode: LanguageCode): void {
    const index = this.translations.findIndex((t) =>
      t.getLanguageCode().equals(languageCode),
    );
    if (index !== -1) {
      this.translations.splice(index, 1);
    }
  }

  /**
   * Replace all translations with new ones
   * @param translations - The new translations
   */
  replaceTranslations(translations: CategoryTranslation[]): void {
    Category.validateInvariants({ translations });
    this.translations.length = 0;
    this.translations.push(...translations);
  }

  /**
   * Replace all attributes with new ones
   * @param attributes - The new attributes
   */
  replaceAttributes(attributes: ProductCategoryAttribute[]): void {
    // Validate all attributes belong to this category
    attributes.forEach((attr) => {
      if (!attr.getCategoryId().equals(this.getId())) {
        throw CategoryDomainError.attributeBelongsToAnotherCategory(
          attr.getId()?.toString() ?? '',
          this.getId()?.toString() ?? '',
        );
      }
    });

    this.attributes.length = 0;
    this.attributes.push(...attributes);
  }

  /**
   * Update a translation of an existing attribute
   * @param attributeId - The attribute ID to update
   * @param languageCode - The language code of the translation
   * @param newValue - The new translation value
   */
  updateAttributeTranslation(
    attributeId: ProductCategoryAttributeId,
    languageCode: LanguageCode,
    newValue: string,
  ): void {
    const attribute = this.findAttributeById(attributeId);
    if (!attribute) {
      throw CategoryDomainError.attributeNotFound(attributeId.toString());
    }

    // L'Aggregate Root controlla la logica di business
    if (attribute.hasTranslation(languageCode)) {
      attribute.updateTranslation(languageCode, newValue);
    } else {
      throw CategoryDomainError.attributeTranslationNotFound(
        attributeId.toString(),
        languageCode.getValue(),
      );
    }
  }

  /**
   * Add a new translation to an existing attribute
   * @param attributeId - The attribute ID
   * @param languageCode - The language code
   * @param value - The translation value
   */
  addAttributeTranslation(
    attributeId: ProductCategoryAttributeId,
    languageCode: LanguageCode,
    value: string,
  ): void {
    const attribute = this.findAttributeById(attributeId);
    if (!attribute) {
      throw CategoryDomainError.attributeNotFound(attributeId.toString());
    }

    // L'Aggregate Root può applicare regole di business globali
    if (attribute.hasTranslation(languageCode)) {
      throw CategoryDomainError.attributeTranslationAlreadyExists(
        attributeId.toString(),
        languageCode.getValue(),
      );
    }

    attribute.addTranslation(languageCode, value);
  }
  //#endregion BUSINESS METHODS
}
