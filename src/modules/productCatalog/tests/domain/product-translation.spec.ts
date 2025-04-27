import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
describe('ProductTranslation', () => {
  describe('Creation', () => {
    it('should create a valid product translation', () => {
      const productTranslation = ProductTranslation.create({
        languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
        description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
        productId: ProductId.create(),
      });
      expect(productTranslation).toBeDefined();
      expect(productTranslation.getLanguageCode()).toStrictEqual(
        LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
      );
      expect(productTranslation.getName()).toBe(
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
      );
      expect(productTranslation.getDescription()).toBe(
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
      );
    });
  });
});
