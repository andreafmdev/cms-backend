import { AggregateRoot } from '@shared/kernel/AggregateRoot';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { CategoryDomainError } from '@module/productCatalog/domain/errors/category-errors';
import { ProductCategoryAttribute } from '../entities/product-category-attribute';
import { LanguageCode } from '../value-objects/language-code';

//#region INTERFACES
interface CategoryProps {
  attributes: ProductCategoryAttribute[];
  translations: CategoryTranslation[];
  id: CategoryId;
}

type CreateCategoryProps = CategoryProps;

type UpdateCategoryProps = Partial<CategoryProps>;

interface ReconstituteProps extends CategoryProps {
  id: CategoryId;
}
//#endregion INTERFACES

export class Category extends AggregateRoot<CategoryId> {
  //#region PROPERTIES

  private readonly attributes: ProductCategoryAttribute[];
  private readonly translations: CategoryTranslation[];
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
   * @param props.attributes - The attributes of the category
   * @param props.translations - The translations of the category
   * @param props.id - The id of the category
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

  //#endregion VALIDATION

  //#region GETTERS
  /**
   * Get all the attributes of the category
   * @returns The attributes of the category
   */
  getAttributes(): ProductCategoryAttribute[] {
    return [...this.attributes]; // Ritorna una copia per proteggere l'immutabilità
  }
  /**
   * Check if the category has a translation in the given language
   * @param languageCode - The language code of the language to check
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
   * Get the translation of the category in the given language
   * @param languageCode - The language code of the language to get the translation in
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
   * @param languageCode - The language code of the language to get the name in
   * @returns The name of the category in the given language
   */
  getName(languageCode: LanguageCode): string {
    return this.getTranslation(languageCode).getName();
  }
  /**
   * Get the description of the category in the given language
   * @param languageCode - The language code of the language to get the description in
   * @returns The description of the category in the given language
   */
  getDescription(languageCode: LanguageCode): string {
    return this.getTranslation(languageCode).getDescription();
  }
  /**
   * Get all the translations of the category
   * @returns The translations of the category
   */
  getTranslations(): CategoryTranslation[] {
    return [...this.translations]; // Ritorna una copia per proteggere l'immutabilità
  }
  //#endregion GETTERS

  //#region BUSINESS METHODS

  /**
   * Add a new attribute to the category
   * @param attribute - The attribute to add
   * @returns The updated category
   */
  addAttribute(attribute: ProductCategoryAttribute): Category {
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

    return this.update({
      attributes: [...this.attributes, attribute],
    });
  }

  update(props: UpdateCategoryProps): Category {
    if (Object.keys(props).length === 0) {
      return this;
    }
    return new Category(
      props.attributes ?? this.attributes,
      props.translations ?? this.translations,
      this.getId() ?? undefined,
    );
  }

  removeAttribute(attribute: ProductCategoryAttribute): Category {
    const filteredAttributes = this.attributes.filter(
      (attr) => !attr.equals(attribute),
    );
    return this.update({ attributes: filteredAttributes });
  }

  addTranslation(translation: CategoryTranslation): Category {
    const currentTranslations = this.getTranslations();
    return this.update({
      translations: [...currentTranslations, translation],
    });
  }

  removeTranslation(translation: CategoryTranslation): Category {
    const filteredTranslations = this.translations.filter(
      (t) => !t.getLanguageCode().equals(translation.getLanguageCode()),
    );
    return this.update({ translations: filteredTranslations });
  }
  //#endregion BUSINESS METHODS
}
