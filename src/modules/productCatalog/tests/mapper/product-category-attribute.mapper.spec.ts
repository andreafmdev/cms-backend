import { Test } from '@nestjs/testing';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { ProductCategoryAttributeMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-mapper';
import { ProductCategoryAttributeOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute.orm-entity';
import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { ProductCategoryAttribute } from '@module/productCatalog/domain/entities/product-category-attribute';
import { ProductCategoryAttributeTranslationMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-translation-mapper';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
describe('ProductCategoryAttributeMapper', () => {
  let productCategoryAttributeMapper: ProductCategoryAttributeMapper;
  let productCategoryAttributeTranslationMapper: ProductCategoryAttributeTranslationMapper;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductCategoryAttributeMapper,
        ProductCategoryAttributeTranslationMapper,
      ],
    }).compile();

    productCategoryAttributeMapper =
      moduleRef.get<ProductCategoryAttributeMapper>(
        ProductCategoryAttributeMapper,
      );
    productCategoryAttributeTranslationMapper =
      moduleRef.get<ProductCategoryAttributeTranslationMapper>(
        ProductCategoryAttributeTranslationMapper,
      );
  });

  describe('toDomain', () => {
    it('should map ORM entity to domain entity', () => {
      const id = ProductCategoryAttributeId.create();
      const categoryId = CategoryId.create();

      const translations: ProductCategoryAttributeTranslation[] = [
        ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .LANGUAGE_CODE,
          ),
          attributeId: id,
        }),
      ];

      const mappedTranslations = translations.map((el) =>
        productCategoryAttributeTranslationMapper.toPersistence(el),
      );
      const ormEntity = new ProductCategoryAttributeOrmEntity();

      ormEntity.id = id.toString();
      ormEntity.categoryId = categoryId.toString();
      ormEntity.translations = mappedTranslations;
      const domainEntity: ProductCategoryAttribute =
        productCategoryAttributeMapper.toDomain(ormEntity);
      const domainId = domainEntity.getId();
      expect(domainId!.toString()).toBe(id.toString());
      expect(domainEntity.getTranslations()).toEqual(translations);
    });
  });

  describe('toPersistence', () => {
    it('should map domain entity to ORM entity', () => {
      const id = ProductCategoryAttributeId.create();
      const categoryId: CategoryId = CategoryId.create();
      const productCategoryAttributeTranslation: ProductCategoryAttributeTranslation =
        ProductCategoryAttributeTranslation.create({
          value: 'Brand',
          languageCode: LanguageCode.create('en'),
          attributeId: id,
        });
      const domainEntity = ProductCategoryAttribute.create({
        translations: [productCategoryAttributeTranslation],
        categoryId: categoryId,
      });

      const ormEntity =
        productCategoryAttributeMapper.toPersistence(domainEntity);

      expect(ormEntity.categoryId).toBe(categoryId.toString());
    });
  });
  describe('bidirectional mapping', () => {
    it('should map domain entity to ORM entity and back to domain entity', () => {
      const id = ProductCategoryAttributeId.create();
      const categoryId = CategoryId.create();
      const translations: ProductCategoryAttributeTranslation[] = [
        ProductCategoryAttributeTranslation.create({
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .LANGUAGE_CODE,
          ),
          attributeId: id,
        }),
      ];
      const domainEntity = ProductCategoryAttribute.create({
        translations: translations,
        categoryId: categoryId,
      });
      const ormEntity =
        productCategoryAttributeMapper.toPersistence(domainEntity);

      const domainEntity2: ProductCategoryAttribute =
        productCategoryAttributeMapper.toDomain(ormEntity);
      const domain2Id = domainEntity2.getId()!.toString();
      const domainId = domainEntity.getId()!.toString();
      expect(domainId).toBe(domain2Id);

      expect(domainEntity2.getTranslations()).toEqual(translations);
      expect(domainEntity2.getCategoryId().toString()).toBe(
        categoryId.toString(),
      );
    });
  });
});
