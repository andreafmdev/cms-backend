import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { FindOptionsWhere } from 'typeorm';

export interface CategoryTranslationInput {
  name: string;
  description: string;
  languageCode: string;
}

export interface AttributeTranslation {
  name: string;
  languageCode: string;
}

export interface AttributeInput {
  translations: AttributeTranslation[];
  id?: string;
}
export interface CategoryTreeFilter
  extends FindOptionsWhere<CategoryOrmEntity> {
  name?: string;
  languageCode?: string;
}
