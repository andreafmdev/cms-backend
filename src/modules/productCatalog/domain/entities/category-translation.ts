import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { LanguageCode } from '../value-objects/language-code';
import { CategoryTranslationDomainError } from '../errors/category-translation-errors';
import { CategoryId } from '../value-objects/category-id';
//#region INTERFACES
export interface CategoryTranslationProps {
  name: string;
  description: string;
  languageCode: LanguageCode;
  categoryId: CategoryId;
}
/**
 * Create category translation properties
 */
export type CreateCategoryTranslationProps = CategoryTranslationProps;
/**
 * Reconstitute category translation properties
 */
type ReconstituteProps = CategoryTranslationProps;

//#endregion INTERFACES
export class CategoryTranslation {
  //#region PROPERTIES
  private name: string;
  private description: string;
  private readonly languageCode: LanguageCode;
  private readonly categoryId: CategoryId;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(
    name: string,
    description: string,
    languageCode: LanguageCode,
    categoryId: CategoryId,
  ) {
    CategoryTranslation.validateInvariants({ name, languageCode });
    this.name = name;
    this.description = description;
    this.languageCode = languageCode;
    this.categoryId = categoryId;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Create a new category translation
   * @param props - The properties of the category translation
   * @param props.name - The name of the category translation
   * @param props.description - The description of the category translation
   * @param props.languageCode - The language code of the category translation
   * @param props.categoryId - The category id of the category translation
   * @returns The new category translation
   */
  static create(props: CreateCategoryTranslationProps): CategoryTranslation {
    return new CategoryTranslation(
      props.name,
      props.description,
      props.languageCode,
      props.categoryId,
    );
  }
  /**
   * Reconstitute a category translation from a database entity
   * @param props - The properties of the category translation
   * @param props.name - The name of the category translation
   * @param props.description - The description of the category translation
   * @param props.languageCode - The language code of the category translation
   * @param props.categoryId - The category id of the category translation
   * @returns The reconstituted category translation
   */
  static reconstitute(props: ReconstituteProps): CategoryTranslation {
    return new CategoryTranslation(
      props.name,
      props.description,
      props.languageCode,
      props.categoryId,
    );
  }
  //#endregion FACTORY METHODS

  //#region VALIDATION
  private static validateInvariants(
    props: Partial<CategoryTranslationProps>,
  ): void {
    if (
      BaseDomainEntity.isNullOrUndefined(props.name) ||
      props.name.trim() === ''
    ) {
      throw CategoryTranslationDomainError.missingName();
    }
    if (BaseDomainEntity.isNullOrUndefined(props.languageCode)) {
      throw CategoryTranslationDomainError.missingLanguageCode();
    }
  }

  private validateName(name: string): void {
    if (BaseDomainEntity.isNullOrUndefined(name) || name.trim() === '') {
      throw CategoryTranslationDomainError.missingName();
    }
  }
  //#endregion VALIDATION

  //#region BUSINESS LOGIC
  /**
   * Update the translation content
   * @param name - The new name
   * @param description - The new description
   */
  update(props: { name: string; description: string }): void {
    this.validateName(props.name);
    this.name = props.name;
    this.description = props.description;
  }

  /**
   * Update the name of the category translation
   * @param name - The new name
   */
  updateName(name: string): void {
    this.validateName(name);
    this.name = name;
  }

  /**
   * Update the description of the category translation
   * @param description - The new description
   */
  updateDescription(description: string): void {
    this.description = description;
  }

  //#endregion BUSINESS LOGIC

  //#region  GETTER
  getName(): string {
    return this.name;
  }
  getLanguageCode(): LanguageCode {
    return this.languageCode;
  }
  getDescription(): string {
    return this.description;
  }
  getCategoryId(): CategoryId {
    return this.categoryId;
  }
  //#endregion GETTER
}
