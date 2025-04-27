import { CategoryMapper } from '@module/productCatalog/infrastructure/mapper/category-mapper';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { ProductCategoryAttributeMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-mapper';
import { CategoryTranslationMapper } from '@module/productCatalog/infrastructure/mapper/category-translation-mapper';
import { ProductCategoryAttributeTranslationMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-translation-mapper';
import { Test } from '@nestjs/testing';
import { ProductCategoryAttributeOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute.orm-entity';
import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';
import { TEST_CONSTANTS } from '@module/productCatalog/tests/utils/constants/test-constants';
import { ProductCategoryAttributeTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-translation.orm-entity';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { ProductCategoryAttribute } from '@module/productCatalog/domain/entities/product-category-attribute';
import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
describe('CategoryMapper', () => {
  let categoryMapper: CategoryMapper;
  /**
   * Category attributes
   */
  let attributeId: ProductCategoryAttributeId;
  let attributeName: string;
  let languageCode: LanguageCode;
  /**
   * Category
   */
  let categoryId: CategoryId;
  let categoryName: string;
  let categoryDescription: string;

  beforeEach(async () => {
    attributeId = ProductCategoryAttributeId.create();
    attributeName =
      TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE;
    languageCode = LanguageCode.create(
      TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
        .LANGUAGE_CODE,
    );
    categoryId = CategoryId.create();
    categoryName = TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME;
    categoryDescription =
      TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION;

    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoryMapper,
        ProductCategoryAttributeMapper,
        CategoryTranslationMapper,
        ProductCategoryAttributeTranslationMapper,
      ],
    }).compile();
    categoryMapper = moduleRef.get<CategoryMapper>(CategoryMapper);
  });

  describe('toDomain', () => {
    it('should map ORM entity to domain entity', () => {
      /**
       * Category
       */
      const ormEntity = new CategoryOrmEntity();
      ormEntity.id = categoryId.toString();
      /**
       * Category translations
       */
      const categoryTranslationOrmEntity = new CategoryTranslationOrmEntity();
      categoryTranslationOrmEntity.categoryId = categoryId.toString();
      categoryTranslationOrmEntity.languageCode = languageCode.getValue();
      categoryTranslationOrmEntity.name = categoryName;
      categoryTranslationOrmEntity.description = categoryDescription;
      ormEntity.translations = [categoryTranslationOrmEntity];
      /**
       * Product category attributes
       */
      const productCategoryAttributeOrmEntity =
        new ProductCategoryAttributeOrmEntity();
      productCategoryAttributeOrmEntity.categoryId = categoryId.toString();
      productCategoryAttributeOrmEntity.id = attributeId.toString();
      /**
       * Product category attribute translations
       */
      const productCategoryAttributeTranslationOrmEntity =
        new ProductCategoryAttributeTranslationOrmEntity();

      productCategoryAttributeTranslationOrmEntity.attributeId =
        attributeId.toString();
      productCategoryAttributeTranslationOrmEntity.languageCode =
        languageCode.getValue();
      productCategoryAttributeTranslationOrmEntity.value = attributeName;

      productCategoryAttributeOrmEntity.translations = [
        productCategoryAttributeTranslationOrmEntity,
      ];
      ormEntity.attributes = [productCategoryAttributeOrmEntity];
      /**
       * Domain Category
       */
      const domainEntity = categoryMapper.toDomain(ormEntity);
      expect(domainEntity).toBeDefined();
      expect(domainEntity.getId().toString()).toBe(categoryId.toString());
      /**
       * Domain Category translations
       */
      expect(domainEntity.getTranslations()).toBeDefined();
      expect(domainEntity.getTranslations().length).toBe(1);
      expect(
        domainEntity.getTranslations()[0].getLanguageCode().getValue(),
      ).toBe(languageCode.getValue());
      expect(domainEntity.getTranslations()[0].getName()).toBe(categoryName);
      expect(domainEntity.getTranslations()[0].getDescription()).toBe(
        categoryDescription,
      );
      /**
       * Domain Product category attributes
       */
      expect(domainEntity.getAttributes()).toBeDefined();
      expect(domainEntity.getAttributes().length).toBe(1);
      expect(domainEntity.getAttributes()[0].getId()?.toString()).toBe(
        attributeId.toString(),
      );
      /**
       * Domain Product category attribute translations
       */
      expect(domainEntity.getAttributes()[0].getTranslations()).toBeDefined();
      expect(domainEntity.getAttributes()[0].getTranslations().length).toBe(1);
      expect(
        domainEntity.getAttributes()[0].getTranslations()[0].getValue(),
      ).toBe(attributeName);
      expect(
        domainEntity.getAttributes()[0].getTranslations()[0].getLanguageCode(),
      ).toStrictEqual(languageCode);
    });
  });
  describe('toOrm', () => {
    it('should map domain entity to ORM entity', () => {
      const productCategoryAttributeDomainEntity =
        ProductCategoryAttribute.create({
          translations: [
            ProductCategoryAttributeTranslation.create({
              value: attributeName,
              languageCode: languageCode,
              attributeId: attributeId,
            }),
          ],
          categoryId: CategoryId.create(categoryId.toString()),
        });
      const categoryDomainEntity = Category.create({
        id: categoryId,
        attributes: [productCategoryAttributeDomainEntity],
        translations: [
          CategoryTranslation.create({
            name: categoryName,
            description: categoryDescription,
            languageCode: languageCode,
            categoryId: categoryId,
          }),
        ],
      });
      const ormEntity = categoryMapper.toPersistence(categoryDomainEntity);
      expect(ormEntity).toBeDefined();
      expect(ormEntity.id).toBe(categoryDomainEntity.getId().toString());
      expect(ormEntity.attributes).toBeDefined();
      expect(ormEntity.attributes.length).toBe(1);
      expect(ormEntity.attributes[0].id).toBe(
        productCategoryAttributeDomainEntity.getId().toString(),
      );
      expect(ormEntity.attributes[0].translations).toBeDefined();
      expect(ormEntity.attributes[0].translations.length).toBe(1);

      expect(ormEntity.attributes[0].translations[0].languageCode).toBe(
        languageCode.getValue(),
      );
      expect(ormEntity.attributes[0].translations[0].value).toBe(attributeName);
      expect(ormEntity.translations).toBeDefined();
      expect(ormEntity.translations.length).toBe(1);
      expect(ormEntity.translations[0].languageCode).toBe(
        languageCode.getValue(),
      );
      expect(ormEntity.translations[0].name).toBe(categoryName);
      expect(ormEntity.translations[0].description).toBe(categoryDescription);
    });
  });
});
