import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { LanguageCodeDomainError } from '@module/productCatalog/domain/errors/language-code-errors';
describe('ProductCategoryAttributeTranslation', () => {
  let translation: ProductCategoryAttributeTranslation;
  let attributeId: ProductCategoryAttributeId;
  beforeEach(() => {
    attributeId = ProductCategoryAttributeId.create();
    translation = ProductCategoryAttributeTranslation.create({
      languageCode: LanguageCode.create(
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
          .LANGUAGE_CODE,
      ),
      value:
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      attributeId: attributeId,
    });
  });
  describe('Creation', () => {
    it('should create a valid product category attribute translation', () => {
      expect(translation).toBeDefined();
      expect(translation.getLanguageCode()).toStrictEqual(
        LanguageCode.create(
          TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
            .LANGUAGE_CODE,
        ),
      );
      expect(translation.getValue()).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      );
    });
    it('should throw an error if the language code is not valid', () => {
      expect(() =>
        ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create('ZZ'),
          attributeId: attributeId,
        }),
      ).toThrow(LanguageCodeDomainError.unsupportedLanguageCode());
    });
  });
  describe('Update', () => {
    it('should update the value of the product category attribute translation', () => {
      const translation = ProductCategoryAttributeTranslation.create({
        languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        value:
          TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      });
      const updatedTranslation = translation.updateValue(
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN.VALUE,
      );
      expect(updatedTranslation).not.toBe(translation);
      expect(updatedTranslation).toBeDefined();
      expect(updatedTranslation.getValue()).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN.VALUE,
      );
    });
  });
});
