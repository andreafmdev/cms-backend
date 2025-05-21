import { EntityId } from '@shared/kernel/BaseDomainEntity';
import { LanguageCodeDomainError } from '../errors/language-code-errors';

export enum SupportedLanguageCodes {
  IT = 'it',
  EN = 'en',
  DE = 'de',
  FR = 'fr',
  ES = 'es',
}
export class LanguageCode implements EntityId<string> {
  private readonly value: string;
  constructor(value: string) {
    this.value = value;
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
    return this.value;
  }
  //#endregion GETTERS

  //#region BUSINESS LOGIC
  isSupported(): boolean {
    return Object.values(SupportedLanguageCodes).includes(
      this.value as SupportedLanguageCodes,
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
    if (!this.value) {
      throw LanguageCodeDomainError.missingValue();
    }
    if (this.value.length !== 2) {
      throw LanguageCodeDomainError.invalidValue();
    }
  }
  //#endregion VALIDATIONS
  equals(other: LanguageCode): boolean {
    return this.value === other.value;
  }
}
