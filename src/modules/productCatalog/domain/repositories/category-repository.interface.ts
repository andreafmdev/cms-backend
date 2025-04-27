import { Category } from '../aggregates/category';

export interface ICategoryRepository {
  createCategory(category: Category): Promise<Category>;
  findAllCategories(): Promise<Category[]>;
}
