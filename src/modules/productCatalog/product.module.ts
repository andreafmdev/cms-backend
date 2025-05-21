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
import { GetProductsHandler } from './application/queries/get-products/get-products.handler';
import { CreateProductHandler } from './application/commands/create-product/create-product.handler';
import { GetProductCatalogHandler } from './application/queries/get-product-catalog/get-product-catalog.handler';
import { SearchProductsHandler } from './application/queries/search-products/search-products.handler';
import { SearchCategoriesHandler } from './application/queries/search-categories/search-categories.handler';
import { SearchBrandsHandler } from './application/queries/search-brands/search-brands.handler';
import { GetBrandDetailHandler } from './application/queries/get-brand-detail/get-brand-detail.handler';
import { GetCategoryDetailHandler } from './application/queries/get-category-detail/get-category-detail.handler';
import { GetProductDetailHandler } from './application/queries/get-product-detail/get-product-detail.handler';
import { GetBrandsQueryHandler } from './application/queries/get-brands/get-brands.query.handler';
import { LanguageMapper } from './infrastructure/mapper/language-mapper';
import { LanguageOrmEntity } from './infrastructure/entities/language.orm-entity';
import { LanguageController } from './language.controller';
import { GetLanguagesHandler } from './application/queries/get-languages/get-languages.handler';
import { LanguageService } from './application/services/language.service';
import { LanguageRepository } from './infrastructure/repositories/language-repository';
import { UploadModule } from '@module/upload/upload.module';
import { GetBrandOptionsQueryHandler } from './application/queries/get-brand-options/get-brand-options.handler';
import { SearchCategoryOptionsHandler } from './application/queries/search-category-tree/search-category-options.handler';
import { CreateBrandCommandHandler } from './application/commands/create-brand/create-brand.handler';
import { UpdateBrandCommandHandler } from './application/commands/update-brand/update-brand.handler';
import { CreateCategoryHandler } from './application/commands/create-category/create-category.handler';
import { DeleteCategoryHandler } from './application/commands/delete-category/delete-category.handler';
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
  LanguageMapper,
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
  LanguageOrmEntity,
];
const repositories = [
  ProductRepository,
  BrandRepository,
  CategoryRepository,
  LanguageRepository,
];
const services = [
  ProductService,
  CategoryService,
  BrandService,
  LanguageService,
];
const seeders = [ProductCatalogSeeder];
const controllers = [
  ProductController,
  CategoryController,
  BrandController,
  LanguageController,
];
const queryHandlers = [
  GetProductsHandler,
  SearchProductsHandler,
  CreateProductHandler,
  GetProductCatalogHandler,
  SearchCategoryOptionsHandler,
  SearchCategoriesHandler,
  SearchBrandsHandler,
  GetBrandDetailHandler,
  GetCategoryDetailHandler,
  GetProductDetailHandler,
  GetBrandsQueryHandler,
  GetLanguagesHandler,
  GetBrandOptionsQueryHandler,
  CreateBrandCommandHandler,
  UpdateBrandCommandHandler,
  CreateCategoryHandler,
  DeleteCategoryHandler,
];
@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([...entities]),
    UploadModule,
  ],
  providers: [
    ...repositories,
    ...services,
    ...mappers,
    ...seeders,
    ...queryHandlers,
  ],
  controllers: [...controllers],
  exports: [ProductCatalogSeeder],
})
export class ProductModule {
  constructor() {}
}
