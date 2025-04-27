import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { ICategoryRepository } from '@module/productCatalog/domain/repositories/category-repository.interface';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { CategoryMapper } from '../mapper/category-mapper';

@Injectable()
export class CategoryRepository
  extends BaseRepository<Category, CategoryOrmEntity, CategoryId>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(CategoryOrmEntity)
    repo: Repository<CategoryOrmEntity>,
    mapper: CategoryMapper,
  ) {
    super(repo, mapper);
  }
  /**
   * Find a product by its ID
   * @param id - The ID of the product to find
   * @returns The product domain entity if found, otherwise null (Product | null)
   */
  async findCategoryById(id: CategoryId): Promise<Category | null> {
    const categoryOrm = await super.findById(id);
    return categoryOrm;
  }
  /**
   * Create a new category
   * @param category - The category domain entity to create
   * @returns The created category domain entity
   */
  async createCategory(category: Category): Promise<Category> {
    const createdCategoryOrm = await super.save(category);
    return createdCategoryOrm;
  }
  async findAllCategories(): Promise<Category[]> {
    const categoryOrms = await super.findAll();
    return categoryOrms;
  }
}
