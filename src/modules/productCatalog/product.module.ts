import { Module } from '@nestjs/common';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { BrandOrmEntity } from '@module/productCatalog/infrastructure/entities/brand.orm-entity';
import { ProductImageOrmEntity } from '@module/productCatalog/infrastructure/entities/product-image.orm-entity';
import { ProductCategoryAttributeValueOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-value.orm-entity';
import { ProductTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-translation.orm-entity';

import { ProductRepository } from '@module/productCatalog/infrastructure/repositories/product-repository';
import { ProductService } from '@module/productCatalog/application/services/product.service';
import { ProductMapper } from '@module/productCatalog/infrastructure/mapper/product-mapper';
import { ProductTranslationMapper } from '@module/productCatalog/infrastructure/mapper/product-translation.mapper';
import { BrandMapper } from '@module/productCatalog/infrastructure/mapper/brand-mapper';
import { CategoryMapper } from '@module/productCatalog/infrastructure/mapper/category-mapper';
import ProductCatalogSeeder from '@module/productCatalog/infrastructure/seeders/product-catalog.seeder';
import { BrandRepository } from '@module/productCatalog/infrastructure/repositories/brand-repository';
import { CategoryRepository } from '@module/productCatalog/infrastructure/repositories/category-repository';
import { ProductCategoryAttributeMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-mapper';
import { ProductCategoryAttributeValueMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-value-mapper';
import { ProductCategoryAttributeTranslationMapper } from '@module/productCatalog/infrastructure/mapper/product-category-attribute-translation-mapper';
import { ProductCategoryAttributeOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute.orm-entity';
import { CategoryTranslationMapper } from '@module/productCatalog/infrastructure/mapper/category-translation-mapper';
import { ProductImageMapper } from '@module/productCatalog/infrastructure/mapper/product-image-mapper';
import { ProductCategoryAttributeTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-translation.orm-entity';
import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';
import { CategoryService } from '@module/productCatalog/application/services/category.service';
import { BrandService } from '@module/productCatalog/application/services/brand.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@base/infrastructure/database/database.module';
import { BrandController } from '@module/productCatalog/brand.controller';
import { CategoryController } from '@module/productCatalog/category.controller';
import { ProductController } from '@module/productCatalog/product.controller';
const mappers = [
  ProductMapper,
  ProductTranslationMapper,
  BrandMapper,
  CategoryMapper,
  CategoryTranslationMapper,
  ProductCategoryAttributeMapper,
  ProductCategoryAttributeValueMapper,
  ProductCategoryAttributeTranslationMapper,
  ProductImageMapper,
];
const entities = [
  CategoryOrmEntity,
  ProductOrmEntity,
  BrandOrmEntity,
  ProductImageOrmEntity,
  ProductCategoryAttributeValueOrmEntity,
  ProductTranslationOrmEntity,
  ProductCategoryAttributeOrmEntity,
  ProductCategoryAttributeTranslationOrmEntity,
  CategoryTranslationOrmEntity,
];
const repositories = [ProductRepository, BrandRepository, CategoryRepository];
const services = [ProductService, CategoryService, BrandService];
const seeders = [ProductCatalogSeeder];
const controllers = [ProductController, CategoryController, BrandController];
@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([...entities]),
  ],
  providers: [
    ...entities,
    ...repositories,
    ...services,
    ...mappers,
    ...seeders,
  ],
  controllers: [...controllers],
  exports: [ProductCatalogSeeder],
})
export class ProductModule {
  constructor() {}
}
