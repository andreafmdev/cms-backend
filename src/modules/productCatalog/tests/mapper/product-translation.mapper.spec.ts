import { ProductTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-translation.orm-entity';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { Test } from '@nestjs/testing';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductTranslationMapper } from '@module/productCatalog/infrastructure/mapper/product-translation.mapper';

describe('ProductTranslationMapper', () => {
  let productTranslationMapper: ProductTranslationMapper;
  let productId: ProductId;
  let languageCode: LanguageCode;
  beforeEach(async () => {
    productId = ProductId.create();
    languageCode = LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT);
    const moduleRef = await Test.createTestingModule({
      providers: [ProductTranslationMapper],
    }).compile();
    productTranslationMapper = moduleRef.get<ProductTranslationMapper>(
      ProductTranslationMapper,
    );
  });
  describe('toDomain', () => {
    it('should map the product translation to the domain', () => {
      const productTranslationOrm = new ProductTranslationOrmEntity();
      productTranslationOrm.productId = productId.toString();
      productTranslationOrm.languageCode = languageCode.getValue();
      productTranslationOrm.name = TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME;
      productTranslationOrm.description =
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION;
      const productTranslationDomain = productTranslationMapper.toDomain(
        productTranslationOrm,
      );
      expect(productTranslationDomain).toBeDefined();
      expect(productTranslationDomain.getProductId()).toStrictEqual(productId);
      expect(productTranslationDomain.getLanguageCode()).toStrictEqual(
        languageCode,
      );
    });
  });
  describe('toPersistence', () => {
    it('should map the product translation to the ORM', () => {
      const productTranslationDomain = ProductTranslation.create({
        productId,
        languageCode,
        name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
        description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
      });
      const productTranslationOrm = productTranslationMapper.toPersistence(
        productTranslationDomain,
      );
      expect(productTranslationOrm).toBeDefined();
      expect(productTranslationOrm.productId).toStrictEqual(
        productId.toString(),
      );
      expect(productTranslationOrm.languageCode).toStrictEqual(
        languageCode.getValue(),
      );
      expect(productTranslationOrm.name).toBe(
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
      );
      expect(productTranslationOrm.description).toBe(
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
      );
    });
  });
  describe('bidirectional mapping', () => {
    it('should map the product translation to the domain and back to the ORM', () => {
      const productTranslationDomain = ProductTranslation.create({
        productId,
        languageCode,
        name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
        description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
      });
      const productTranslationOrm = productTranslationMapper.toPersistence(
        productTranslationDomain,
      );
      const productTranslationDomain2 = productTranslationMapper.toDomain(
        productTranslationOrm,
      );
      expect(productTranslationDomain2).toBeDefined();
      expect(productTranslationDomain2.getProductId()).toStrictEqual(productId);
      expect(productTranslationDomain2.getLanguageCode()).toStrictEqual(
        languageCode,
      );
      expect(productTranslationDomain2.getName()).toBe(
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
      );
      expect(productTranslationDomain2.getDescription()).toBe(
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
      );
    });
  });
});
