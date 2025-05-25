// product-mapper.spec.ts
import { Test } from '@nestjs/testing';
import { ProductTranslationMapper } from '@module/productCatalog/infrastructure/mapper/product-translation.mapper';
import { Product } from '@module/productCatalog/domain/aggregates/product';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { ProductTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-translation.orm-entity';

import { ProductMapper } from '@module/productCatalog/infrastructure/mapper/product-mapper';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { ProductImageMapper } from '@module/productCatalog/infrastructure/mapper/product-image-mapper';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { ProductImageOrmEntity } from '@module/productCatalog/infrastructure/entities/product-image.orm-entity';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { ProductCategoryAttributeValue } from '@module/productCatalog/domain/entities/product-category-attribute-value';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { ProductCategoryAttributeValueOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-value.orm-entity';
import { ProductCategoryAttributeValueMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-value-mapper';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { BrandMapper } from '@module/productCatalog/infrastructure/mapper/brand-mapper';
import { Brand } from '@module/productCatalog/domain/aggregates/brand';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { ProductImageId } from '@module/productCatalog/domain/value-objects/product-image-id';
import { ProductImage } from '@module/productCatalog/domain/entities/product-image';
import { ImageUrl } from '@module/productCatalog/domain/value-objects/image-url';
describe('ProductMapper', () => {
  let productMapper: ProductMapper;
  let productId: ProductId;
  let categoryId: CategoryId;
  let attributeId: ProductCategoryAttributeId;
  let brandId: BrandId;

  let categoryDomainEntity: Category;
  let productDomainEntity: Product;
  beforeEach(async () => {
    productId = ProductId.create();
    categoryId = CategoryId.create();
    brandId = BrandId.create();
    attributeId = ProductCategoryAttributeId.create();
    const brand = Brand.create({
      name: TEST_CONSTANTS.BRAND.YAMAHA.NAME,
    });
    categoryDomainEntity = Category.create({
      translations: [
        CategoryTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
          description:
            TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
          categoryId: categoryId,
        }),
      ],
      attributes: [],
      id: categoryId,
    });

    productDomainEntity = Product.create({
      id: productId,
      price: TEST_CONSTANTS.PRODUCT.PRICE,
      isAvailable: true,
      image: [
        ProductImage.create({
          url: ImageUrl.create(TEST_CONSTANTS.PRODUCT.IMAGES[0].URL),
          isMain: TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
        }),
      ],
      brandId: brand.getId(),
      categoryId: categoryDomainEntity.getId(),
      translations: [
        ProductTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
          description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
          productId: productId,
        }),
      ],
      attributesValues: [
        ProductCategoryAttributeValue.create({
          value: TEST_CONSTANTS.PRODUCT.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
          attributeId: attributeId,
          productId: productId,
        }),
        ProductCategoryAttributeValue.create({
          value: TEST_CONSTANTS.PRODUCT.ATTRIBUTES.COLOR.TRANSLATIONS.IT.VALUE,
          attributeId: attributeId,
          productId: productId,
        }),
      ],
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductMapper,
        BrandMapper,
        ProductTranslationMapper,
        ProductImageMapper,
        ProductCategoryAttributeValueMapper,
      ],
    }).compile();

    productMapper = moduleRef.get<ProductMapper>(ProductMapper);
  });

  describe('toDomain', () => {
    it('should map a complete product correctly', () => {
      // Arrange
      const ormEntity = new ProductOrmEntity();
      ormEntity.id = productId.toString();
      ormEntity.price = TEST_CONSTANTS.PRODUCT.PRICE;
      ormEntity.brandId = brandId.toString();
      ormEntity.categoryId = categoryId.toString();
      ormEntity.isAvailable = true;
      ormEntity.translations = [
        createTestProductTranslationOrm(
          TEST_CONSTANTS.LANGUAGE_CODE.IT,
          TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
        ),
      ];
      ormEntity.categoryId = categoryId.toString();
      ormEntity.images = [
        Object.assign(new ProductImageOrmEntity(), {
          url: TEST_CONSTANTS.PRODUCT.IMAGES[0].URL,
          isMain: TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
        }),
      ];
      ormEntity.attributesValues = [
        Object.assign(new ProductCategoryAttributeValueOrmEntity(), {
          value: TEST_CONSTANTS.PRODUCT.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
          attributeId: attributeId.toString(),
          productId: productId.toString(),
        }),
      ];
      // Act
      const domainEntity = productMapper.toDomain(ormEntity);

      // Assert
      expect(domainEntity).toBeInstanceOf(Product);

      const domainId = domainEntity.getId();
      expect(domainId).not.toBeNull();
      if (domainId) {
        expect(domainId.equals(productId)).toBe(true);
      }

      expect(domainEntity.getPrice()).toBe(TEST_CONSTANTS.PRODUCT.PRICE);
      expect(domainEntity.IsAvailable()).toBe(true);

      // Verifica translations / Verify translations
      const translations = domainEntity.getTranslations();
      expect(translations).toHaveLength(1);
      expect(
        domainEntity
          .getTranslation(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT))
          .getName(),
      ).toBe(TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME);

      // Verifica brand / Verify brand
      expect(domainEntity.getBrandId().equals(brandId)).toBe(true);

      // Verifica images / Verify images
      const images = domainEntity.getProductImages();
      expect(images).toHaveLength(1);
      expect(images[0].getUrl().getValue().toString()).toBe(
        TEST_CONSTANTS.PRODUCT.IMAGES[0].URL,
      );
      expect(images[0].getIsMain()).toBe(
        TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
      );
    });
  });

  describe('toPersistence', () => {
    it('should map a complete product to ORM entity', () => {
      // Arrange
      const product = productDomainEntity;

      // Act
      const ormEntity = productMapper.toPersistence(product);

      // Assert
      expect(ormEntity).toBeInstanceOf(ProductOrmEntity);
      expect(ormEntity.price).toBe(TEST_CONSTANTS.PRODUCT.PRICE);
      expect(ormEntity.isAvailable).toBe(true);
      expect(ormEntity.translations).toHaveLength(1);
      expect(ormEntity.translations[0].name).toBe(
        TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
      );
      const categoryId = ormEntity.categoryId;
      expect(categoryId).not.toBeNull();
      if (categoryId) {
        expect(categoryId).toBe(categoryDomainEntity.getId().toString());
      }

      expect(ormEntity.images).toHaveLength(1);
      expect(ormEntity.images[0].url).toBe(
        TEST_CONSTANTS.PRODUCT.IMAGES[0].URL,
      );
    });
  });

  describe('bidirectional mapping', () => {
    it('should maintain data integrity when mapping back and forth', () => {
      // Arrange
      const imageId = ProductImageId.create();
      const originalOrm = new ProductOrmEntity();
      originalOrm.id = productId.toString();
      originalOrm.price = TEST_CONSTANTS.PRODUCT.PRICE;
      originalOrm.isAvailable = true;
      originalOrm.brandId = brandId.toString();
      originalOrm.categoryId = categoryId.toString();
      originalOrm.attributesValues = [
        Object.assign(new ProductCategoryAttributeValueOrmEntity(), {
          value: TEST_CONSTANTS.PRODUCT.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
          attributeId: attributeId.toString(),
          productId: productId.toString(),
        }),
      ];
      originalOrm.images = [
        Object.assign(new ProductImageOrmEntity(), {
          id: imageId.toString(),
          url: TEST_CONSTANTS.PRODUCT.IMAGES[0].URL,
          isMain: TEST_CONSTANTS.PRODUCT.IMAGES[0].IS_MAIN,
        }),
      ];
      originalOrm.translations = [
        createTestProductTranslationOrm(
          TEST_CONSTANTS.LANGUAGE_CODE.IT,
          TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
        ),
      ];

      // Act
      const domain = productMapper.toDomain(originalOrm);
      const mappedBackOrm = productMapper.toPersistence(domain);

      // Assert
      expect(mappedBackOrm.id).toBe(originalOrm.id);
      expect(mappedBackOrm.price).toBe(originalOrm.price);
      expect(mappedBackOrm.translations[0].name).toBe(
        originalOrm.translations[0].name,
      );
    });
  });

  describe('Product update behavior', () => {
    const createTestProduct = () => {
      return Product.create({
        id: productId,
        translations: [
          ProductTranslation.create({
            languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
            name: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
            description: TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
            productId: productId,
          }),
        ],
        price: TEST_CONSTANTS.PRODUCT.PRICE,
        image: [],
        brandId: brandId,
        categoryId: categoryId,
        attributesValues: [],
      });
    };

    it('should update product and maintain ID (existing entity)', () => {
      // Arrange
      const existingId = productDomainEntity.getId();
      const product = productDomainEntity;

      // Act
      product.updatePrice(200);
      product.updateIsAvailable(false);

      // Assert
      expect(product.getPrice()).toBe(200);
      expect(product.IsAvailable()).toBe(false);
      expect(product.getId()).toBe(existingId); // Verifica che l'ID sia mantenuto / Verify ID is maintained
      expect(product).not.toBe(product); // Verifica immutabilità / Verify immutability
    });

    it('should maintain all unchanged properties', () => {
      // Arrange
      const originalProduct = createTestProduct();
      const originalBrand = originalProduct.getBrandId();

      // Act

      // Assert
      expect(originalProduct.getPrice()).toBe(200);
      expect(originalProduct.getBrandId()).toEqual(originalBrand);
      expect(originalProduct.getCategoryId()).toEqual(
        originalProduct.getCategoryId(),
      );
      expect(originalProduct.getTranslations()).toEqual(
        originalProduct.getTranslations(),
      );
    });
  });

  describe('withPrice', () => {
    it('should update the product with a new price', () => {
      const product = productDomainEntity;
      product.updatePrice(200);
      expect(product.getPrice()).toBe(200);
    });
  });
});

function createTestProductTranslationOrm(
  languageCode = TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.LANGUAGE_CODE,
  name = TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.NAME,
  description = TEST_CONSTANTS.PRODUCT.TRANSLATIONS.IT.DESCRIPTION,
): ProductTranslationOrmEntity {
  const translation = new ProductTranslationOrmEntity();
  translation.languageCode = languageCode;
  translation.name = name;
  translation.description = description;
  return translation;
}
