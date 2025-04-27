import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';
import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { Test } from '@nestjs/testing';
import { TEST_CONSTANTS } from '@module/productCatalog/tests/utils/constants/test-constants';
import { CategoryTranslationMapper } from '@module/productCatalog/infrastructure/mapper/category-translation-mapper';

describe('CategoryTranslationMapper', () => {
  let categoryTranslationMapper: CategoryTranslationMapper;
  let categoryId: CategoryId;
  let languageCode: LanguageCode;

  beforeEach(async () => {
    categoryId = CategoryId.create();
    languageCode = LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT);
    const moduleRef = await Test.createTestingModule({
      providers: [CategoryTranslationMapper],
    }).compile();
    categoryTranslationMapper = moduleRef.get<CategoryTranslationMapper>(
      CategoryTranslationMapper,
    );
  });

  describe('toDomain', () => {
    it('should map the category translation to the domain', () => {
      const categoryTranslationOrm = new CategoryTranslationOrmEntity();
      categoryTranslationOrm.categoryId = categoryId.toString();
      categoryTranslationOrm.languageCode = languageCode.getValue();
      categoryTranslationOrm.name =
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME;
      categoryTranslationOrm.description =
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION;

      const categoryTranslationDomain = categoryTranslationMapper.toDomain(
        categoryTranslationOrm,
      );

      expect(categoryTranslationDomain).toBeDefined();
      expect(categoryTranslationDomain.getCategoryId()).toStrictEqual(
        categoryId,
      );
      expect(categoryTranslationDomain.getLanguageCode()).toStrictEqual(
        languageCode,
      );
      expect(categoryTranslationDomain.getName()).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
      );
      expect(categoryTranslationDomain.getDescription()).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
      );
    });
  });

  describe('toPersistence', () => {
    it('should map the category translation to the ORM', () => {
      const categoryTranslationDomain = CategoryTranslation.create({
        categoryId,
        languageCode,
        name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
        description: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
      });

      const categoryTranslationOrm = categoryTranslationMapper.toPersistence(
        categoryTranslationDomain,
      );

      expect(categoryTranslationOrm).toBeDefined();
      expect(categoryTranslationOrm.categoryId).toStrictEqual(
        categoryId.toString(),
      );
      expect(categoryTranslationOrm.languageCode).toStrictEqual(
        languageCode.getValue(),
      );
      expect(categoryTranslationOrm.name).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
      );
      expect(categoryTranslationOrm.description).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
      );
    });
  });

  describe('bidirectional mapping', () => {
    it('should map the category translation to the domain and back to the ORM', () => {
      const categoryTranslationDomain = CategoryTranslation.create({
        categoryId,
        languageCode,
        name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
        description: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
      });

      const categoryTranslationOrm = categoryTranslationMapper.toPersistence(
        categoryTranslationDomain,
      );

      const categoryTranslationDomain2 = categoryTranslationMapper.toDomain(
        categoryTranslationOrm,
      );

      expect(categoryTranslationDomain2).toBeDefined();
      expect(categoryTranslationDomain2.getCategoryId()).toStrictEqual(
        categoryId,
      );
      expect(categoryTranslationDomain2.getLanguageCode()).toStrictEqual(
        languageCode,
      );
      expect(categoryTranslationDomain2.getName()).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
      );
      expect(categoryTranslationDomain2.getDescription()).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
      );
    });
  });
});
