import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '@module/productCatalog/infrastructure/repositories/category-repository';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { FindOptionsWhere } from 'typeorm';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';

import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductCategoryAttribute } from '@module/productCatalog/domain/entities/product-category-attribute';
import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { ProductCategoryAttributeId } from '@module/productCatalog/domain/value-objects/product-category-attribute-id';
import {
  AttributeInput,
  CategoryTranslationInput,
  CategoryTreeFilter,
} from '../types/category.types';
import { LanguageService } from '@module/productCatalog/application/services/language.service';
import { ProductService } from './product.service';
import { Language } from '@module/productCatalog/domain/entities/language';
@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly languageService: LanguageService,
    private readonly productService: ProductService,
  ) {}

  async findCategoryById(id: CategoryId): Promise<Category | null> {
    return await this.categoryRepository.findById(id);
  }
  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
  async createCategory(props: {
    translations: CategoryTranslationInput[];
    attributeTranslations: AttributeInput[];
  }): Promise<Category> {
    //create category id
    const categoryId = CategoryId.create();
    //create category translation entities
    const translationEntities: CategoryTranslation[] = [];
    const activeLanguages = await this.languageService.findAllActiveLanguages();

    for (const translationData of props.translations) {
      //check if language is active for category
      if (
        !this.getActiveLanguage(activeLanguages, translationData.languageCode)
      ) {
        throw new ConflictException(
          `Language ${translationData.languageCode} is not active for category`,
        );
      }
      //check if translation already exists
      const existingTranslation =
        await this.categoryRepository.findExistingCategoryTranslation(
          translationData.name,
          translationData.languageCode,
          categoryId.getStringValue(),
        );
      if (existingTranslation) {
        throw new ConflictException(
          `Translation ${translationData.languageCode.toString().toUpperCase()} already exists for category`,
        );
      }
      const translation = CategoryTranslation.create({
        name: translationData.name,
        description: translationData.description,
        languageCode: LanguageCode.create(translationData.languageCode),
        categoryId: categoryId,
      });
      translationEntities.push(translation);
    }
    //create attribute
    const attributeEntities: ProductCategoryAttribute[] = [];
    if (props.attributeTranslations) {
      for (const attributeData of props.attributeTranslations) {
        const attributeId = ProductCategoryAttributeId.create();
        const attributeTranslationEntities: ProductCategoryAttributeTranslation[] =
          [];

        for (const translationData of attributeData.translations) {
          if (
            !this.getActiveLanguage(
              activeLanguages,
              translationData.languageCode,
            )
          ) {
            throw new ConflictException(
              `Language ${translationData.languageCode} is not active for attribute`,
            );
          }
          //todo: check if attribute translation already exists globally??
          const attributeTranslation =
            ProductCategoryAttributeTranslation.create({
              value: translationData.name,
              languageCode: LanguageCode.create(translationData.languageCode),
              attributeId: attributeId,
            });
          attributeTranslationEntities.push(attributeTranslation);
        }
        const attribute = ProductCategoryAttribute.create({
          translations: attributeTranslationEntities,
          categoryId: categoryId,
        });
        attributeEntities.push(attribute);
      }
    }
    const category = Category.create({
      id: categoryId,
      translations: translationEntities,
      attributes: attributeEntities,
    });
    return await this.categoryRepository.save(category);
  }
  // FIND CATEGORY BY ID WITH ATTRIBUTES
  async findCategoryByIdWithAttributes(
    productId: ProductId,
    languageCode: string,
  ): Promise<
    {
      attributeId: string;
      attributeName: string;
      attributeValue: string;
    }[]
  > {
    return await this.categoryRepository.findProductCategoryAttributesWithValues(
      productId.getValue().toString(),
      languageCode,
    );
  }
  async findCategoriesByFilters(
    filters: CategoryTreeFilter,
  ): Promise<Category[]> {
    return await this.categoryRepository.findAllByCondition({
      filters: filters as FindOptionsWhere<CategoryOrmEntity>,
    });
  }
  async findCategoriesByTranslationNameAndLanguage({
    name,
    languageCode,
  }: {
    name?: string;
    languageCode?: string;
  }): Promise<Category[]> {
    return await this.categoryRepository.findAllByTranslationNameAndLanguage(
      name,
      languageCode,
    );
  }
  async searchCategories(filters: {
    name?: string;
    languageCode: string;
    page?: number;
    limit?: number;
  }): Promise<Category[]> {
    return await this.categoryRepository.searchCategories(filters);
  }
  async searchCategoriesCount(filters: {
    name?: string;
    languageCode: string;
  }): Promise<number> {
    return await this.categoryRepository.searchCategoriesCount(filters);
  }
  async deleteCategory(id: CategoryId): Promise<boolean> {
    const category = await this.findCategoryById(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const products = await this.productService.findProductsByCategoryId(id);
    if (products.length > 0) {
      throw new ConflictException('Category has products');
    }

    await this.categoryRepository.remove(category);
    const deletedCategory = await this.findCategoryById(id);
    return deletedCategory === null;
  }
  async updateCategory(
    id: CategoryId,
    props: {
      categoryTranslations: CategoryTranslationInput[];
      attributes: AttributeInput[];
    },
  ): Promise<Category> {
    const category = await this.findCategoryById(id);
    const activeLanguages = await this.languageService.findAllActiveLanguages();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Update translations
    for (const categoryTranslation of props.categoryTranslations) {
      if (
        !this.getActiveLanguage(
          activeLanguages,
          categoryTranslation.languageCode,
        )
      ) {
        throw new ConflictException(
          `Language ${categoryTranslation.languageCode} is not active for category`,
        );
      }
      //check if translation already exists

      const languageCode = LanguageCode.create(
        categoryTranslation.languageCode,
      );
      const existingTranslation =
        await this.categoryRepository.findExistingCategoryTranslation(
          categoryTranslation.name,
          categoryTranslation.languageCode,
          category.getId().getStringValue(),
        );
      if (existingTranslation) {
        throw new ConflictException(
          `Translation ${categoryTranslation.languageCode.toString().toUpperCase()} already exists for category ${existingTranslation.getId().toString()} - ${existingTranslation.getName(languageCode)}`,
        );
      }

      //if translation does not exist, check if it already exists
      if (!category.hasTranslation(languageCode)) {
        const newTranslation = CategoryTranslation.create({
          name: categoryTranslation.name,
          description: categoryTranslation.description,
          languageCode: languageCode,
          categoryId: category.getId(),
        });
        category.addTranslation(newTranslation);
      } else {
        category.updateTranslation(
          languageCode,
          categoryTranslation.name,
          categoryTranslation.description,
        );
      }
    }

    // Update attributes
    const currentAttributeIds = props.attributes
      .map((attr) => attr.id)
      .filter(Boolean);
    const existingAttributes = category.getAttributes();

    // Rimuovi attributi non più presenti
    for (const existingAttr of existingAttributes) {
      if (!currentAttributeIds.includes(existingAttr.getId().toString())) {
        // Controlla se ci sono prodotti con valori per questo attributo
        const productsWithValues =
          await this.productService.findProductsWithAttributeValues(
            existingAttr.getId(),
          );

        if (productsWithValues.length > 0) {
          throw new ConflictException(
            `Cannot remove attributes" because ${productsWithValues.length} products have values for it`,
          );
        }
        await this.categoryRepository.removeAttributeById(
          existingAttr.getId().toString(),
        );

        category.removeAttributeById(existingAttr.getId());
      }
    }
    if (props.attributes.length > 0) {
      for (const attribute of props.attributes) {
        if (!attribute.id) {
          // Create new attribute
          const newAttributeId = ProductCategoryAttributeId.create();
          const newAttributeTranslations: ProductCategoryAttributeTranslation[] =
            [];

          for (const attributeTranslation of attribute.translations) {
            if (
              !this.getActiveLanguage(
                activeLanguages,
                attributeTranslation.languageCode,
              )
            ) {
              throw new ConflictException(
                `Language ${attributeTranslation.languageCode} is not active for attribute`,
              );
            }

            const languageCode = LanguageCode.create(
              attributeTranslation.languageCode,
            );
            newAttributeTranslations.push(
              ProductCategoryAttributeTranslation.create({
                value: attributeTranslation.name,
                languageCode: languageCode,
                attributeId: newAttributeId,
              }),
            );
          }

          category.addAttribute(
            ProductCategoryAttribute.create({
              translations: newAttributeTranslations,
              categoryId: category.getId(),
            }),
          );
        } else {
          // Update existing attribute
          const existingAttribute = category.findAttributeById(
            ProductCategoryAttributeId.create(attribute.id),
          );
          if (existingAttribute) {
            for (const attributeTranslation of attribute.translations) {
              if (
                !this.getActiveLanguage(
                  activeLanguages,
                  attributeTranslation.languageCode,
                )
              ) {
                throw new ConflictException(
                  `Language ${attributeTranslation.languageCode} is not active for attribute`,
                );
              }

              const languageCode = LanguageCode.create(
                attributeTranslation.languageCode,
              );
              if (existingAttribute.hasTranslation(languageCode)) {
                category.updateAttributeTranslation(
                  existingAttribute.getId(),
                  languageCode,
                  attributeTranslation.name,
                );
              } else {
                category.addAttributeTranslation(
                  existingAttribute.getId(),
                  languageCode,
                  attributeTranslation.name,
                );
              }
            }
          }
        }
      }
    } else {
      await this.categoryRepository.removeAllAttributesByCategoryId(
        category.getId().getStringValue(),
      );
      category.clearAllAttributes();
    }

    return await this.categoryRepository.save(category);
  }

  private getActiveLanguage(
    languages: Language[],
    languageCode: string,
  ): boolean {
    return languages.some(
      (language) => language.getCode().getValue() === languageCode,
    );
  }
}
