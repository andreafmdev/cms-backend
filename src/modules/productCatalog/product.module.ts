import { Module } from '@nestjs/common';
import { ProductOrmEntity } from './infrastructure/entities/product.orm-entity';
import { CategoryOrmEntity } from './infrastructure/entities/category.orm-entity';
import { BrandOrmEntity } from './infrastructure/entities/brand.orm-entity';
import { ProductImageOrmEntity } from './infrastructure/entities/product-image.orm-entity';
import { ProductAttributeValueOrmEntity } from './infrastructure/entities/product-attribute-value.orm-entity';
import { ProductTranslationOrmEntity } from './infrastructure/entities/product-translation.orm-entity';

import { ProductRepository } from './infrastructure/repositories/product-repository';
import { ProductService } from './application/services/product.service';
import { ProductMapper } from './infrastructure/mapper/product.mapper';
import ProductCatalogSeeder from './infrastructure/seeders/product-catalog.seeder';
const mappers = [ProductMapper];
const entities = [
  ProductOrmEntity,
  CategoryOrmEntity,
  BrandOrmEntity,
  ProductImageOrmEntity,
  ProductAttributeValueOrmEntity,
  ProductTranslationOrmEntity,
];
const repositories = [ProductRepository];
const services = [ProductService];
const seeders = [ProductCatalogSeeder];
@Module({
  imports: [],
  providers: [
    ...entities,
    ...repositories,
    ...services,
    ...mappers,
    ...seeders,
  ],
  exports: [ProductCatalogSeeder],
})
export class ProductModule {
  constructor() {}
}
