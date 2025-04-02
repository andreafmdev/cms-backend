import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { BrandOrmEntity } from '../entities/brand.orm-entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductTranslationOrmEntity } from '../entities/product-translation.orm-entity';
import { CategoryOrmEntity } from '../entities/category.orm-entity';
import { CategoryTranslationOrmEntity } from '../entities/category-translation.orm-entity';

export default class ProductCatalogSeeder implements Seeder {
  private readonly logger = new Logger(ProductCatalogSeeder.name);
  private readonly SUPPORTED_LANGUAGES = ['it', 'en'] as const;

  public async run(dataSource: DataSource): Promise<void> {
    const brandRepository = dataSource.getRepository(BrandOrmEntity);
    const categoryRepository = dataSource.getRepository(CategoryOrmEntity);
    const categoryTranslationRepository = dataSource.getRepository(
      CategoryTranslationOrmEntity,
    );
    const productRepository = dataSource.getRepository(ProductOrmEntity);
    const productTranslationRepository = dataSource.getRepository(
      ProductTranslationOrmEntity,
    );

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('🚀 Starting ProductCatalogSeeder...');

      // 1. Crea Brands
      this.logger.log('⚙️ Creating brands...');
      const brands = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          return await brandRepository.save({
            name: faker.company.name(),
          });
        }),
      );
      this.logger.log(`✅ Created ${brands.length} brands`);

      // 2. Crea Categories con translations
      this.logger.log('⚙️ Creating categories with translations...');
      const categories = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          // Crea la categoria
          const category = await categoryRepository.save({
            name: faker.commerce.department(),
            description: faker.commerce.productDescription(),
            image: faker.image.url(),
          });

          // Crea le traduzioni per la categoria
          await Promise.all(
            this.SUPPORTED_LANGUAGES.map(async (languageCode) => {
              return await categoryTranslationRepository.save({
                categoryId: category.id,
                languageCode,
                name: faker.commerce.department(),
              });
            }),
          );

          return category;
        }),
      );
      this.logger.log(
        `✅ Created ${categories.length} categories with translations`,
      );

      // 3. Crea Products con translations
      this.logger.log('⚙️ Creating products with translations...');
      await Promise.all(
        Array.from({ length: 4 }).map(async () => {
          // Crea il prodotto
          const product = await productRepository.save({
            price: Number(faker.commerce.price({ min: 10, max: 1000 })),
            isAvailable: faker.datatype.boolean(),
            brandId: faker.helpers.arrayElement(brands).id,
            categoryId: faker.helpers.arrayElement(categories).id,
          });

          // Crea le traduzioni per il prodotto
          const translations = await Promise.all(
            this.SUPPORTED_LANGUAGES.map(async (languageCode) => {
              return await productTranslationRepository.save({
                productId: product.id,
                languageCode,
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
              });
            }),
          );

          product.translations = translations;
          await productRepository.save(product);
          return product;
        }),
      );
      this.logger.log('✅ Created products with translations');

      await queryRunner.commitTransaction();
      this.logger.log('🎉 Seeding completed successfully!');
    } catch (error) {
      this.logger.error('❌ Error during seeding:', error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private createTranslatedName(baseEntity: string): Record<string, string> {
    return {
      it: `${baseEntity} in Italiano`,
      en: `${baseEntity} in English`,
    };
  }
}
