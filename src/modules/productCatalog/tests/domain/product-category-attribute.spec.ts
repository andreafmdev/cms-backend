import { ProductCategoryAttribute } from '@module/productCatalog/domain/entities/product-category-attribute';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { ProductCategoryAttributeDomainError } from '@module/productCatalog/domain/errors/product-category-attribute-errors';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';

describe('ProductCategoryAttribute Domain Entity', () => {
  let categoryId: CategoryId;

  beforeEach(() => {
    categoryId = CategoryId.create();
  });

  describe('Creation', () => {
    describe('successful creation', () => {
      it('should create a valid product category attribute', () => {
        const translation = ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        });
        const attribute = ProductCategoryAttribute.create({
          translations: [translation],
          categoryId: categoryId,
        });

        expect(attribute).toBeDefined();
        expect(attribute.getTranslations()).toHaveLength(1);
        expect(attribute.getTranslations()[0]).toEqual(translation);
        expect(attribute.getCategoryId()).toEqual(categoryId);
      });
      it('should create a valid product category attribute with multiple diferent translations', () => {
        const translationIT = ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        });
        const translationEN = ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
        });
        const attribute = ProductCategoryAttribute.create({
          translations: [translationIT, translationEN],
          categoryId: categoryId,
        });

        expect(attribute).toBeDefined();
        expect(attribute.getTranslations()).toHaveLength(2);
        expect(attribute.getTranslations()[0]).toEqual(translationIT);
        expect(attribute.getTranslations()[1]).toEqual(translationEN);
      });
    });
    describe('failed creation', () => {
      it('should throw an error if the translations are missing', () => {
        expect(() =>
          ProductCategoryAttribute.create({ translations: [], categoryId }),
        ).toThrow(ProductCategoryAttributeDomainError.missingTranslations());
      });
      it('should throw an error if the translations are dublicated and not unique', () => {
        const translation = ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        });
        expect(() =>
          ProductCategoryAttribute.create({
            translations: [translation, translation],
            categoryId,
          }),
        ).toThrow(
          ProductCategoryAttributeDomainError.duplicatedTranslations(
            TEST_CONSTANTS.LANGUAGE_CODE.IT,
          ),
        );
      });
    });
  });
  describe('Update', () => {
    describe('successful update', () => {
      it('should update a valid product category attribute', () => {
        const translation = ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        });
        const newTranslation = ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
        });
        const attribute = ProductCategoryAttribute.create({
          translations: [translation],
          categoryId,
        });
        const updatedAttribute = attribute.updateTranslation(
          LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
          newTranslation.getValue(),
        );
        expect(updatedAttribute).toBeDefined();
        expect(attribute.getTranslations()).toHaveLength(1);
        expect(attribute.getTranslations()[0]).toEqual(translation);
        expect(attribute.getTranslations()).toHaveLength(1);
        expect(attribute.getTranslations()[0]).toEqual(newTranslation);
      });
    });
  });
});
