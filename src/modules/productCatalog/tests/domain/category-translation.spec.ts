import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { CategoryTranslationDomainError } from '@module/productCatalog/domain/errors/category-translation-errors';
describe('CategoryTranslation', () => {
  describe('Creation', () => {
    it('should create a category translation', () => {
      const categoryId = CategoryId.create();
      const categoryTranslation = CategoryTranslation.create({
        name: 'Test',
        description: 'Test',
        languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        categoryId: categoryId,
      });
      expect(categoryTranslation).toBeDefined();
      expect(categoryTranslation.getName()).toBe('Test');
      expect(categoryTranslation.getDescription()).toBe('Test');
      expect(categoryTranslation.getLanguageCode()).toStrictEqual(
        LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
      );
      expect(categoryTranslation.getCategoryId()).toStrictEqual(categoryId);
    });
    it('should throw an error if the name is empty', () => {
      expect(() =>
        CategoryTranslation.create({
          name: '',
          description:
            TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          categoryId: CategoryId.create(),
        }),
      ).toThrow(CategoryTranslationDomainError.missingName());
    });
  });
  describe('Update', () => {
    it('should update the name of the category translation', () => {
      const categoryTranslation = CategoryTranslation.create({
        name: 'Test',
        description: 'Test',
        languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        categoryId: CategoryId.create(),
      });
      categoryTranslation.update({
        name: 'Updated Test',
        description: 'Updated Test',
      });
      expect(categoryTranslation).toBeDefined();
      expect(categoryTranslation.getName()).toBe('Updated Test');
      expect(categoryTranslation.getDescription()).toBe('Updated Test');
      expect(categoryTranslation.getLanguageCode()).toStrictEqual(
        LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
      );
    });
  });
});
