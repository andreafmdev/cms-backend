import { Language } from '@module/productCatalog/domain/entities/language';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { LanguageRepository } from '@module/productCatalog/infrastructure/repositories/language-repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepository: LanguageRepository) {}

  async findLanguageById(id: LanguageCode): Promise<Language | null> {
    return await this.languageRepository.findLanguageById(id);
  }
  async findAllLanguages(): Promise<Language[]> {
    return await this.languageRepository.findAllLanguages();
  }
  async findAllActiveLanguages(): Promise<Language[]> {
    return await this.languageRepository.findAllActiveLanguages();
  }
  async findActiveLanguageByCode(code: LanguageCode): Promise<Language | null> {
    return await this.languageRepository.findActiveLanguageByCode(code);
  }
  async findDefaultLanguage(): Promise<Language | null> {
    return await this.languageRepository.findDefaultLanguage();
  }
  async createLanguage(language: Language): Promise<Language> {
    return await this.languageRepository.createLanguage(language);
  }
}
