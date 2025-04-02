import { ProductTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-translation.orm-entity';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { BrandOrmEntity } from '@module/productCatalog/infrastructure/entities/brand.orm-entity';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { ProductImageOrmEntity } from '@module/productCatalog/infrastructure/entities/product-image.orm-entity';
import { ProductAttributeValueOrmEntity } from '@module/productCatalog/infrastructure/entities/product-attribute-value.orm-entity';
import { ProductAttributeTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-attribute-translation.orm-entity';
import { ProductAttributeOrmEntity } from '@module/productCatalog/infrastructure/entities/product-attribute.orm-entity';
import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';

export const ProductEntities = [
  ProductOrmEntity,
  CategoryOrmEntity,
  CategoryTranslationOrmEntity,
  BrandOrmEntity,
  ProductImageOrmEntity,
  ProductAttributeValueOrmEntity,
  ProductTranslationOrmEntity,
  ProductAttributeOrmEntity,
  ProductAttributeTranslationOrmEntity,
];
