import { Language } from '../entities/language';
import { LanguageCode } from '../value-objects/language-code';

export interface ILanguageRepository {
  createLanguage(language: Language): Promise<Language>;
  findAllLanguages(): Promise<Language[]>;
  findLanguageById(id: LanguageCode): Promise<Language | null>;
  findActiveLanguageByCode(code: LanguageCode): Promise<Language | null>;
}
