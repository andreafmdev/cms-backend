import { ProductCategoryAttributeTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-translation.orm-entity';
import { ProductCategoryAttributeTranslationMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-translation-mapper';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { Test } from '@nestjs/testing';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
describe('ProductCategoryAttributeTranslationMapper', () => {
  let attributeId: ProductCategoryAttributeId;
  let productAttributeTranslationMapper: ProductCategoryAttributeTranslationMapper;
  beforeEach(async () => {
    attributeId = ProductCategoryAttributeId.create();
    const moduleRef = await Test.createTestingModule({
      providers: [ProductCategoryAttributeTranslationMapper],
    }).compile();
    productAttributeTranslationMapper =
      moduleRef.get<ProductCategoryAttributeTranslationMapper>(
        ProductCategoryAttributeTranslationMapper,
      );
  });

  describe('toDomain', () => {
    it('should map the product category attribute translation to the domain', () => {
      const value =
        TEST_CONSTANTS.PRODUCT.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE;
      const productCategoryAttributeTranslationOrm =
        new ProductCategoryAttributeTranslationOrmEntity();
      productCategoryAttributeTranslationOrm.attributeId =
        attributeId.toString();
      productCategoryAttributeTranslationOrm.languageCode =
        TEST_CONSTANTS.LANGUAGE_CODE.IT;
      productCategoryAttributeTranslationOrm.value = value;
      const productCategoryAttributeTranslationDomain =
        productAttributeTranslationMapper.toDomain(
          productCategoryAttributeTranslationOrm,
        );
      expect(productCategoryAttributeTranslationDomain).toBeDefined();
      expect(
        productCategoryAttributeTranslationDomain.getAttributeId(),
      ).toStrictEqual(attributeId);
    });
  });
  describe('toPersistence', () => {
    it('should map the product category attribute translation to the ORM', () => {
      const value =
        TEST_CONSTANTS.PRODUCT.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE;
      const productCategoryAttributeTranslationDomain =
        ProductCategoryAttributeTranslation.create({
          attributeId,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          value,
        });
      const productCategoryAttributeTranslationOrm =
        productAttributeTranslationMapper.toPersistence(
          productCategoryAttributeTranslationDomain,
        );
      expect(productCategoryAttributeTranslationOrm).toBeDefined();
      expect(productCategoryAttributeTranslationOrm.attributeId).toBe(
        attributeId.toString(),
      );
      expect(productCategoryAttributeTranslationOrm.languageCode).toBe(
        TEST_CONSTANTS.LANGUAGE_CODE.IT,
      );
      expect(productCategoryAttributeTranslationOrm.value).toBe(value);
    });
  });
  describe('bidirectional mapping', () => {
    it('should map the product category attribute translation to the domain and back to the ORM', () => {
      const value =
        TEST_CONSTANTS.PRODUCT.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE;
      //create domain entity
      const productCategoryAttributeTranslationDomain =
        ProductCategoryAttributeTranslation.create({
          attributeId,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          value,
        });
      //map to ORM
      const productCategoryAttributeTranslationOrm =
        productAttributeTranslationMapper.toPersistence(
          productCategoryAttributeTranslationDomain,
        );
      //map to domain
      const productCategoryAttributeTranslationDomain2 =
        productAttributeTranslationMapper.toDomain(
          productCategoryAttributeTranslationOrm,
        );
      expect(productCategoryAttributeTranslationDomain2).toBeDefined();
      expect(
        productCategoryAttributeTranslationDomain2.getAttributeId(),
      ).toStrictEqual(attributeId);
      expect(
        productCategoryAttributeTranslationDomain2.getLanguageCode(),
      ).toStrictEqual(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT));
      expect(productCategoryAttributeTranslationDomain2.getValue()).toBe(value);
    });
  });
});
