import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@module/productCatalog/infrastructure/repositories/category-repository';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { FindOptionsWhere } from 'typeorm';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
interface CategoryTreeFilter extends FindOptionsWhere<CategoryOrmEntity> {
  name?: string;
  languageCode?: string;
}
@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findCategoryById(id: CategoryId): Promise<Category | null> {
    return await this.categoryRepository.findById(id);
  }
  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.findAll();
  }
  async createCategory(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
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
}
