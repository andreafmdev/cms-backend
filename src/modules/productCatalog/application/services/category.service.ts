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
    const activeLanguages = await this.languageService.findAllActiveLanguages();
    const categoryId = CategoryId.create();
    //create category translation entities
    const translationEntities: CategoryTranslation[] = [];

    for (const translationData of props.translations) {
      if (
        !activeLanguages.some(
          (language) =>
            language.getCode().getValue() === translationData.languageCode,
        )
      ) {
        throw new ConflictException(
          `Language ${translationData.languageCode} is not active`,
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
    for (const attributeData of props.attributeTranslations) {
      const attributeId = ProductCategoryAttributeId.create();
      const attributeTranslationEntities: ProductCategoryAttributeTranslation[] =
        [];

      for (const translationData of attributeData.translations) {
        //todo: check if attribute translation already exists globally??
        const attributeTranslation = ProductCategoryAttributeTranslation.create(
          {
            value: translationData.name,
            languageCode: LanguageCode.create(translationData.languageCode),
            attributeId: attributeId,
          },
        );
        attributeTranslationEntities.push(attributeTranslation);
      }
      const attribute = ProductCategoryAttribute.create({
        translations: attributeTranslationEntities,
        categoryId: categoryId,
      });
      attributeEntities.push(attribute);
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
    languageCode?: string;
    page?: number;
    limit?: number;
  }): Promise<Category[]> {
    return await this.categoryRepository.searchCategories(filters);
  }
  async searchCategoriesCount(filters: {
    name?: string;
    languageCode?: string;
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
}
