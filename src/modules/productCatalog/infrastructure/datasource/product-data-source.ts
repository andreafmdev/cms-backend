import { ProductTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-translation.orm-entity';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { BrandOrmEntity } from '@module/productCatalog/infrastructure/entities/brand.orm-entity';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { ProductImageOrmEntity } from '@module/productCatalog/infrastructure/entities/product-image.orm-entity';
import { ProductCategoryAttributeValueOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-value.orm-entity';
import { ProductCategoryAttributeTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-translation.orm-entity';
import { ProductCategoryAttributeOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute.orm-entity';
import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';
import { LanguageOrmEntity } from '@module/productCatalog/infrastructure/entities/language.orm-entity';
export const ProductEntities = [
  CategoryOrmEntity,
  ProductOrmEntity,
  CategoryTranslationOrmEntity,
  BrandOrmEntity,
  ProductImageOrmEntity,
  ProductCategoryAttributeValueOrmEntity,
  ProductTranslationOrmEntity,
  ProductCategoryAttributeOrmEntity,
  ProductCategoryAttributeTranslationOrmEntity,
  LanguageOrmEntity,
];
