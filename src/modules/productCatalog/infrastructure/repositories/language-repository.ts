import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ILanguageRepository } from '@module/productCatalog/domain/repositories/language-repository.interface';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { LanguageOrmEntity } from '../entities/language.orm-entity';
import { Language } from '@module/productCatalog/domain/entities/language';
import { LanguageMapper } from '../mapper/language-mapper';
@Injectable()
export class LanguageRepository
  extends BaseRepository<Language, LanguageOrmEntity, LanguageCode>
  implements ILanguageRepository
{
  constructor(
    @InjectRepository(LanguageOrmEntity)
    repo: Repository<LanguageOrmEntity>,
    mapper: LanguageMapper,
  ) {
    super(repo, mapper);
  }
  async findAllLanguages(): Promise<Language[]> {
    const languages = await super.findAll();
    return languages;
  }
  async findLanguageById(id: LanguageCode): Promise<Language | null> {
    const language = await super.findById(id);
    return language;
  }
  async createLanguage(language: Language): Promise<Language> {
    const createdLanguage = await super.save(language);
    return createdLanguage;
  }
  async findAllActiveLanguages(): Promise<Language[]> {
    const languages = await super.findAllByCondition({
      filters: { isActive: true },
    });
    return languages;
  }
  async findDefaultLanguage(): Promise<Language | null> {
    const language = await super.findOneByCondition({
      isDefault: true,
    });
    return language;
  }
}
