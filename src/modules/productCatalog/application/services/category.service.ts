import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@module/productCatalog/infrastructure/repositories/category-repository';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
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
}
