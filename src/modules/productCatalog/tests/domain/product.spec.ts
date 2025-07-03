// product.spec.ts
import { LanguageCode } from '../../domain/value-objects/language-code';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { Product } from '@module/productCatalog/domain/aggregates/product';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductImage } from '@module/productCatalog/domain/entities/product-image';
import { ProductDomainError } from '@module/productCatalog/domain/errors/product-errors';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { ImageUrl } from '@module/productCatalog/domain/value-objects/image-url';
describe('Product Domain Entity', () => {
  let product: Product;
  beforeEach(() => {
    const productId = ProductId.create();

    const translations = [
      ProductTranslation.create({
        languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
        description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
        productId: productId,
      }),
    ];
    const image1 = ProductImage.create({
      url: ImageUrl.create(TEST_CONSTANTS.PRODUCT.IMAGES[0].URL),
      isMain: true,
      name: TEST_CONSTANTS.PRODUCT.IMAGES[0].NAME,
      order: TEST_CONSTANTS.PRODUCT.IMAGES[0].ORDER,
    });
    const categoryId = CategoryId.create();
    product = Product.create({
      translations,
      price: TEST_CONSTANTS.PRODUCT.PRICE,
      isAvailable: TEST_CONSTANTS.PRODUCT.IS_AVAILABLE,
      categoryId: categoryId,
      image: [image1],
      brandId: BrandId.create(),
      attributesValues: [],
      id: productId,
    });
  });

  describe('Creation', () => {
    it('should create a valid product with all required properties', () => {
      expect(product).toBeDefined();
      expect(product.getId()?.getStringValue()).toBeDefined();
      expect(product.getPrice()).toBe(TEST_CONSTANTS.PRODUCT.PRICE);
      expect(product.getTranslations()).toHaveLength(1);
      expect(
        product
          .getTranslation(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT))
          .getName(),
      ).toBe(TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME);
    });
    it('should throw error when no translations provided', () => {
      expect(() => {
        const productId = ProductId.create();
        const categoryId = CategoryId.create();
        Product.create({
          translations: [],
          price: TEST_CONSTANTS.PRODUCT.PRICE,
          isAvailable: TEST_CONSTANTS.PRODUCT.IS_AVAILABLE,
          categoryId: categoryId,
          image: [],
          brandId: BrandId.create(),
          attributesValues: [],
          id: productId,
        });
      }).toThrow(ProductDomainError.noTranslations());
    });
    it('should throw error when duplicate translations provided', () => {
      const productId = ProductId.create();
      const categoryId = CategoryId.create();
      const translations = [
        ProductTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
          description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
          productId: productId,
        }),
        ProductTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
          description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
          productId: productId,
        }),
      ];
      expect(() => {
        Product.create({
          price: TEST_CONSTANTS.PRODUCT.PRICE,
          isAvailable: TEST_CONSTANTS.PRODUCT.IS_AVAILABLE,
          categoryId: categoryId,
          image: [],
          brandId: BrandId.create(),
          attributesValues: [],
          translations: [...translations],
          id: productId,
        });
      }).toThrow(
        ProductDomainError.duplicateTranslation(
          LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        ),
      );
    });
  });

  describe('Product attributes', () => {
    it('should add and manage attributes', () => {
      const attributeId = ProductCategoryAttributeId.create();

      expect(product.getAttributesValues()).toHaveLength(1);
      expect(product.hasAttribute(attributeId)).toBeTruthy();
    });

    it('should update existing attribute', () => {
      const attributeId = ProductCategoryAttributeId.create();

      product.addAttribute('Grande', attributeId);
      product.addAttribute('Medio', attributeId);
    });
  });

  describe('Translations', () => {
    it('should handle multiple translations', () => {
      const image1 = ProductImage.create({
        url: ImageUrl.create(TEST_CONSTANTS.PRODUCT.IMAGES[0].URL),
        isMain: true,
        name: TEST_CONSTANTS.PRODUCT.IMAGES[0].NAME,
        order: TEST_CONSTANTS.PRODUCT.IMAGES[0].ORDER,
      });
      const productId = ProductId.create();
      const categoryId = CategoryId.create();
      const translations = [
        ProductTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
          description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
          productId: productId,
        }),
        ProductTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
          name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.EN.NAME,
          description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.EN.DESCRIPTION,
          productId: productId,
        }),
      ];
      const product = Product.create({
        translations,
        price: TEST_CONSTANTS.PRODUCT.PRICE,
        isAvailable: TEST_CONSTANTS.PRODUCT.IS_AVAILABLE,
        categoryId: categoryId,
        image: [image1],
        brandId: BrandId.create(),
        attributesValues: [],
        id: productId,
      });

      expect(product.getTranslations()).toHaveLength(2);
      expect(
        product
          .getTranslation(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT))
          .getName(),
      ).toBe(TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME);
      expect(
        product
          .getTranslation(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN))
          .getName(),
      ).toBe(TEST_CONSTANTS.PRODUCT.TRANSLATIONS.EN.NAME);
    });
  });

  describe('Updates', () => {
    it('should update properties immutably', () => {
      const originalId = product.getId();
      product.updatePrice(2000);
      product.updateIsAvailable(false);
      product.addTranslation(
        ProductTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
          name: 'Grand Piano',
          description: 'Classic grand piano',
          productId: originalId,
        }),
      );

      expect(product.getPrice()).toBe(2000);
      expect(product.IsAvailable()).toBe(false);
      expect(product.getId()).toEqual(originalId);
      expect(product.getTranslations()).toHaveLength(2);

      expect(product.getPrice()).toBe(1000);
      expect(product.IsAvailable()).toBe(true);
      expect(product.getTranslations()).toHaveLength(1);
    });
    describe('Update translations', () => {
      it('should throw error when remove all translations (product must have at least one translation)', () => {
        expect(() =>
          product.removeTranslation(
            LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          ),
        ).toThrow(ProductDomainError.noTranslations());
      });
      it('should throw error when remove a translation that does not exist', () => {
        expect(() =>
          product.removeTranslation(
            LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
          ),
        ).toThrow(
          ProductDomainError.translationNotFound(
            LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
          ),
        );
      });
    });
  });
});
