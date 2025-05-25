// category.spec.ts
import { LanguageCode } from '../../domain/value-objects/language-code';
import { CategoryDomainError } from '../../domain/errors/category-errors';
import { CategoryTranslation } from '../../domain/entities/category-translation';
import { ProductCategoryAttribute } from '../../domain/entities/product-category-attribute';
import { ProductCategoryAttributeTranslation } from '../../domain/entities/product-category-attribute-translation';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { TEST_CONSTANTS } from '../utils/constants/test-constants';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
describe('Category Domain Entity', () => {
  let category: Category;
  beforeEach(() => {
    const translations = [
      CategoryTranslation.create({
        languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
        description: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
        categoryId: CategoryId.create(),
      }),
    ];
    category = Category.create({
      translations,
      attributes: [],
      id: CategoryId.create(),
    });
  });
  describe('Creation', () => {
    it('should create a valid category with required properties', () => {
      expect(category).toBeDefined();

      expect(category.getId()).toBeDefined();
      expect(category.getTranslations()).toHaveLength(1);
      expect(
        category.getName(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT)),
      ).toBe(TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME);
      expect(
        category.getDescription(
          LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
        ),
      ).toBe(TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION);
    });

    it('should throw error when no translations provided', () => {
      const categoryId = CategoryId.create();
      expect(() =>
        Category.create({
          translations: [],
          attributes: [],
          id: categoryId,
        }),
      ).toThrow(CategoryDomainError.missingTranslations());
    });

    it('should throw error when duplicate translations provided', () => {
      const categoryId = CategoryId.create();
      const duplicateTranslations = [
        CategoryTranslation.create({
          languageCode: LanguageCode.create('it'),
          name: 'Pianoforti',
          description: 'Descrizione 1',
          categoryId: categoryId,
        }),
        CategoryTranslation.create({
          languageCode: LanguageCode.create('it'),
          name: 'Altro nome',
          description: 'Descrizione 2',
          categoryId: categoryId,
        }),
      ];

      expect(() =>
        Category.create({
          translations: duplicateTranslations,
          attributes: [],
          id: categoryId,
        }),
      ).toThrow(CategoryDomainError.duplicateTranslation('it'));
    });
  });

  describe('Attributes Management', () => {
    it('should add a new attribute', () => {
      const attributeId = ProductCategoryAttributeId.create();
      const attributeTranslationIT = ProductCategoryAttributeTranslation.create(
        {
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          attributeId: attributeId,
        },
      );
      const attributeTranslationEN = ProductCategoryAttributeTranslation.create(
        {
          value:
            TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN
              .VALUE,
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
          attributeId: attributeId,
        },
      );
      const attribute = ProductCategoryAttribute.create({
        translations: [attributeTranslationIT, attributeTranslationEN],
        categoryId: category.getId(),
      });

      category.addAttribute(attribute);

      expect(category.getAttributes()).toHaveLength(1);
      expect(category.hasAttribute(attribute)).toBeTruthy();
    });
    it('should throw error when adding an attribute to another category', () => {
      const attributeId = ProductCategoryAttributeId.create();
      const newCategoryId = CategoryId.create();
      const attribute = ProductCategoryAttribute.create({
        translations: [
          ProductCategoryAttributeTranslation.create({
            value:
              TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
                .VALUE,
            languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
            attributeId: attributeId,
          }),
        ],
        categoryId: newCategoryId,
      });
      expect(() => category.addAttribute(attribute)).toThrow(
        CategoryDomainError.attributeBelongsToAnotherCategory(
          attribute.getId()?.toString() ?? '',
          category.getId()?.toString() ?? '',
        ),
      );
    });

    it('should handle attribute with multiple translations', () => {
      const attributeId = ProductCategoryAttributeId.create();

      const multilingualAttribute = ProductCategoryAttribute.create({
        translations: [
          ProductCategoryAttributeTranslation.create({
            value:
              TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
                .VALUE,
            languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
            attributeId: attributeId,
          }),
          ProductCategoryAttributeTranslation.create({
            value:
              TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN
                .VALUE,
            languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
            attributeId: attributeId,
          }),
        ],
        categoryId: category.getId(),
      });

      category.addAttribute(multilingualAttribute);
      const attribute = category.getAttributes()[0];

      expect(attribute.getTranslations()).toHaveLength(2);
      expect(
        attribute
          .getTranslation(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT))
          .getValue(),
      ).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT.VALUE,
      );
      expect(
        attribute.getTranslation(LanguageCode.create('en')).getValue(),
      ).toBe(
        TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.EN.VALUE,
      );
    });

    it('should remove an attribute', () => {
      const attributeId = ProductCategoryAttributeId.create();
      const categoryId = category.getId();
      const attribute = ProductCategoryAttribute.create({
        translations: [
          ProductCategoryAttributeTranslation.create({
            value:
              TEST_CONSTANTS.CATEGORY.PIANOS.ATTRIBUTES.SIZE.TRANSLATIONS.IT
                .VALUE,
            languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
            attributeId: attributeId,
          }),
        ],
        categoryId: categoryId,
      });

      category.addAttribute(attribute);
      category.removeAttribute(attribute);

      expect(category.getAttributes()).toHaveLength(0);
      expect(category.hasAttribute(attribute)).toBeFalsy();
    });
  });

  describe('Translations Management', () => {
    it('should handle multiple translations', () => {
      const categoryId = CategoryId.create();
      const translations = [
        CategoryTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT),
          name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME,
          description:
            TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.DESCRIPTION,
          categoryId: categoryId,
        }),
        CategoryTranslation.create({
          languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
          name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.EN.NAME,
          description:
            TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.EN.DESCRIPTION,
          categoryId: categoryId,
        }),
      ];
      category = Category.create({
        translations,
        attributes: [],
        id: categoryId,
      });
      expect(category).toBeDefined();
      expect(category.getId()).toBeDefined();
      expect(category.getTranslations()).toHaveLength(2);
      expect(
        category.getName(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.IT)),
      ).toBe(TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.IT.NAME);
      expect(
        category.getName(LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN)),
      ).toBe(TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.EN.NAME);
    });
  });

  describe('Immutability', () => {
    it('should maintain immutability when updating', () => {
      const newTranslation = CategoryTranslation.create({
        languageCode: LanguageCode.create(TEST_CONSTANTS.LANGUAGE_CODE.EN),
        name: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.EN.NAME,
        description: TEST_CONSTANTS.CATEGORY.PIANOS.TRANSLATIONS.EN.DESCRIPTION,
        categoryId: CategoryId.create(),
      });

      category.addTranslation(newTranslation);

      expect(category.getTranslations()).toHaveLength(2);
    });
  });
});
