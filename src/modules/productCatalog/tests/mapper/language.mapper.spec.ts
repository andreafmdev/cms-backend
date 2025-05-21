import { Test } from '@nestjs/testing';
import { LanguageMapper } from '@module/productCatalog/infrastructure/mapper/language-mapper';
import { Language } from '@module/productCatalog/domain/entities/language';
import { LanguageOrmEntity } from '@module/productCatalog/infrastructure/entities/language.orm-entity';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';

describe('LanguageMapper', () => {
  let languageMapper: LanguageMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [LanguageMapper],
    }).compile();
    languageMapper = moduleRef.get<LanguageMapper>(LanguageMapper);
  });

  describe('toDomain', () => {
    it('should map ORM entity to domain entity', () => {
      const ormEntity = new LanguageOrmEntity();
      const languageCode = LanguageCode.create('en');
      ormEntity.code = languageCode.getValue();
      ormEntity.name = 'English';
      ormEntity.isActive = true;
      ormEntity.isDefault = false;

      const domainEntity = languageMapper.toDomain(ormEntity);
      expect(domainEntity).toBeDefined();
      expect(domainEntity.getCode().getValue()).toStrictEqual(
        languageCode.getValue(),
      );
      expect(domainEntity.getName()).toBe('English');
      expect(domainEntity.getIsActive()).toBe(true);
      expect(domainEntity.getIsDefault()).toBe(false);
    });
  });

  describe('toPersistence', () => {
    it('should map domain entity to ORM entity', () => {
      const language: Language = Language.create({
        code: LanguageCode.create('en'),
        name: 'English',
        isActive: true,
        isDefault: false,
      });

      const ormEntity = languageMapper.toPersistence(language);
      expect(ormEntity.code).toBe(LanguageCode.create('en').getValue());
      expect(ormEntity.name).toBe('English');
      expect(ormEntity.isActive).toBe(true);
      expect(ormEntity.isDefault).toBe(false);
    });
  });
});
