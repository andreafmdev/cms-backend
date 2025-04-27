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
/**
 * Update category translation properties
 */
type UpdateCategoryTranslationProps = Partial<CategoryTranslationProps>;

//#endregion INTERFACES
export class CategoryTranslation {
  //#region PROPERTIES
  private readonly name: string;
  private readonly description: string;
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
  //#endregion VALIDATION

  //#region BUSINESS LOGIC
  /**
   * Update the category translation
   * @param props - The properties of the category translation
   * @param props.name - The name of the category translation
   * @param props.description - The description of the category translation
   * @param props.languageCode - The language code of the category translation
   * @param props.categoryId - The category id of the category translation
   * @returns The updated category translation
   */
  update(props: UpdateCategoryTranslationProps): CategoryTranslation {
    return new CategoryTranslation(
      props.name ?? this.name,
      props.description ?? this.description,
      props.languageCode ?? this.languageCode,
      props.categoryId ?? this.categoryId,
    );
  }
  /**
   * Update the name of the category translation
   * @param name - The name of the category translation
   * @returns The updated category translation
   */
  updateName(name: string): CategoryTranslation {
    return this.update({ name });
  }
  /**
   * Update the language code of the category translation
   * @param languageCode - The language code of the category translation
   * @returns The updated category translation
   */
  updateLanguageCode(languageCode: LanguageCode): CategoryTranslation {
    return this.update({ languageCode });
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
