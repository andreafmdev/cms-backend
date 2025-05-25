import { BaseDomainEntity } from '@shared/kernel/BaseDomainEntity';
import { LanguageDomainError } from '../errors/language-errors';
import { LanguageCode } from '../value-objects/language-code';
//#region INTERFACES
interface CreateLanguageProps {
  code: LanguageCode;
  name: string;
  isActive: boolean;
  isDefault: boolean;
}
interface ReconstituteLanguageProps {
  code: LanguageCode;
  name: string;
  isActive: boolean;
  isDefault: boolean;
}
//#endregion INTERFACES
interface UpdateLanguageProps {
  name?: string;
  isActive?: boolean;
  isDefault?: boolean;
}
export class Language extends BaseDomainEntity<LanguageCode> {
  //#region PROPERTIES
  private name: string;
  private isActive: boolean;
  private isDefault: boolean;
  //#endregion PROPERTIES

  //#region CONSTRUCTOR
  private constructor(
    name: string,
    isActive: boolean,
    isDefault: boolean,
    code: LanguageCode, //it's the id
  ) {
    Language.validateInvariants({
      name: name,
      isActive: isActive,
      isDefault: isDefault,
      code: code,
    });
    super(code);
    this.name = name;
    this.isActive = isActive;
    this.isDefault = isDefault;
  }
  //#endregion CONSTRUCTOR

  //#region FACTORY METHODS
  /**
   * Create a new language
   * @param props - The properties of the language
   * @param props.code - The code of the language
   * @param props.name - The name of the language
   * @param props.isActive - Whether the language is active
   * @param props.isDefault - Whether the language is the default language
   */
  static create(props: CreateLanguageProps): Language {
    return new Language(
      props.name,
      props.isActive,
      props.isDefault,
      props.code,
    );
  }
  static reconstitute(props: ReconstituteLanguageProps): Language {
    return new Language(
      props.name,
      props.isActive,
      props.isDefault,
      props.code,
    );
  }
  //#endregion FACTORY METHODS

  //#region VALIDATION
  private static validateInvariants(props: Partial<CreateLanguageProps>): void {
    if (BaseDomainEntity.isNullOrUndefined(props.code)) {
      throw LanguageDomainError.missingCode();
    }
    if (BaseDomainEntity.isNullOrUndefined(props.name)) {
      throw LanguageDomainError.missingName();
    }
  }
  //#endregion VALIDATION

  //#region GETTERS
  getCode(): LanguageCode {
    return this.getId();
  }

  getName(): string {
    return this.name;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getIsDefault(): boolean {
    return this.isDefault;
  }

  //#endregion GETTERS

  //#region MUTATORS
  updateName(name: string): void {
    Language.validateInvariants({ name });
    this.name = name;
  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  setAsDefault(): void {
    this.isDefault = true;
  }

  unsetAsDefault(): void {
    this.isDefault = false;
  }

  update(props: UpdateLanguageProps): void {
    if (props.name !== undefined) {
      this.name = props.name;
    }
    if (props.isActive !== undefined) this.isActive = props.isActive;
    if (props.isDefault !== undefined) this.isDefault = props.isDefault;
  }
  //#endregion MUTATORS
}
