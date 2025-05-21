import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { FindOptionsWhere } from 'typeorm';

export interface CategoryTranslationInput {
  name: string;
  description: string;
  languageCode: string;
}

export interface AttributeTranslationInput {
  name: string;
  languageCode: string;
}

export interface AttributeInput {
  translations: AttributeTranslationInput[];
}
export interface CategoryTreeFilter
  extends FindOptionsWhere<CategoryOrmEntity> {
  name?: string;
  languageCode?: string;
}
