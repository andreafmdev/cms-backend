import { ValueObject } from '@shared/kernel/ValueObject';
import { LanguageCodeDomainError } from '../errors/language-code-errors';
interface LanguageCodeProps {
  value: string;
}
export enum SupportedLanguageCodes {
  IT = 'it',
  EN = 'en',
  DE = 'de',
  FR = 'fr',
  ES = 'es',
}
export class LanguageCode extends ValueObject<LanguageCodeProps> {
  constructor(value: string) {
    super({ value: value.toLowerCase() });
    this.validate();
  }
  //#region FACTORY METHODS
  static create(value: string): LanguageCode {
    return new LanguageCode(value);
  }
  static getAllSupportedCodes(): string[] {
    return Object.values(SupportedLanguageCodes);
  }
  //#endregion FACTORY METHODS

  //#region GETTERS
  getValue(): string {
    return this.props.value;
  }
  //#endregion GETTERS

  //#region BUSINESS LOGIC
  isSupported(): boolean {
    return Object.values(SupportedLanguageCodes).includes(
      this.props.value as SupportedLanguageCodes,
    );
  }
  //#endregion BUSINESS LOGIC

  //#region VALIDATIONS
  private validate(): void {
    this.validateValue();
    this.validateSupported();
  }
  private validateSupported(): void {
    if (!this.isSupported()) {
      throw LanguageCodeDomainError.unsupportedLanguageCode();
    }
  }
  private validateValue(): void {
    if (!this.props.value) {
      throw LanguageCodeDomainError.missingValue();
    }
    if (this.props.value.length !== 2) {
      throw LanguageCodeDomainError.invalidValue();
    }
  }
  //#endregion VALIDATIONS
}
