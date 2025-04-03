import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { BrandOrmEntity } from '../entities/brand.orm-entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductTranslationOrmEntity } from '../entities/product-translation.orm-entity';
import { CategoryOrmEntity } from '../entities/category.orm-entity';
import { CategoryTranslationOrmEntity } from '../entities/category-translation.orm-entity';
import { ProductAttributeOrmEntity } from '../entities/product-attribute.orm-entity';
import { ProductAttributeValueOrmEntity } from '../entities/product-attribute-value.orm-entity';
import { ProductAttributeTranslationOrmEntity } from '../entities/product-attribute-translation.orm-entity';
import { ProductImageOrmEntity } from '../entities/product-image.orm-entity';

export default class ProductCatalogSeeder implements Seeder {
  private readonly logger = new Logger(ProductCatalogSeeder.name);
  private readonly SUPPORTED_LANGUAGES = ['it', 'en'] as const;

  public async run(dataSource: DataSource): Promise<void> {
    const brandRepository = dataSource.getRepository(BrandOrmEntity);
    const categoryRepository = dataSource.getRepository(CategoryOrmEntity);
    const categoryTranslationRepository = dataSource.getRepository(
      CategoryTranslationOrmEntity,
    );
    const productAttributeRepository = dataSource.getRepository(
      ProductAttributeOrmEntity,
    );
    const productAttributeTranslationRepository = dataSource.getRepository(
      ProductAttributeTranslationOrmEntity,
    );
    const productAttributeValueRepository = dataSource.getRepository(
      ProductAttributeValueOrmEntity,
    );

    const productRepository = dataSource.getRepository(ProductOrmEntity);
    const productTranslationRepository = dataSource.getRepository(
      ProductTranslationOrmEntity,
    );
    const productImageRepository = dataSource.getRepository(
      ProductImageOrmEntity,
    );
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      this.logger.log('🚀 Starting ProductCatalogSeeder...');

      // 1. create brands
      this.logger.log('⚙️ Creating brands...');
      const brandsToCreate = Array.from({ length: 3 }).map(() => ({
        name: faker.company.name(),
      }));
      const brands = await brandRepository.save(brandsToCreate);
      this.logger.log(`✅ Created ${brands.length} brands`);

      // 2. create categories with translations
      this.logger.log('⚙️ creating categories with translations...');
      const categories = await Promise.all(
        Array.from({ length: 3 }).map(async () => {
          // Crea la categoria
          const category = await categoryRepository.save({
            name: faker.commerce.department(),
            description: faker.commerce.productDescription(),
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
          // Crea attributi per la categoria
          const attributeNames = [
            faker.helpers.arrayElement(['Colore', 'Materiale', 'Dimensione']),
            faker.helpers.arrayElement(['Peso', 'Potenza', 'Tipo']),
            faker.helpers.arrayElement(['Marca', 'Modello', 'Anno']),
          ];

          // Crea gli attributi per la categoria
          await Promise.all(
            attributeNames.map(async (attributeName) => {
              const attribute = await productAttributeRepository.save({
                categoryId: category.id,
                name: attributeName,
              });

              // Crea le traduzioni per l'attributo
              await Promise.all(
                this.SUPPORTED_LANGUAGES.map(async (languageCode) => {
                  return await productAttributeTranslationRepository.save({
                    productAttributeId: attribute.id,
                    languageCode,
                    value: this.getAttributeTranslation(
                      attributeName,
                      languageCode,
                    ),
                  });
                }),
              );

              return attribute;
            }),
          );
          //create attributes for category
          return category;
        }),
      );
      this.logger.log(
        `✅ Created ${categories.length} categories with translations`,
      );
      //create attribute for categories
      // 3. Crea Products con translations

      this.logger.log('⚙️ Creating products with translations...');
      await Promise.all(
        Array.from({ length: 4 }).map(async () => {
          const selectedCategory = faker.helpers.arrayElement(categories);
          const categoryAttributes = await productAttributeRepository.find({
            where: { categoryId: selectedCategory.id },
          });
          // Create Product
          const product = await productRepository.save({
            price: Number(faker.commerce.price({ min: 10, max: 1000 })),
            isAvailable: faker.datatype.boolean(),
            brandId: faker.helpers.arrayElement(brands).id,
            categoryId: selectedCategory.id,
          });

          // Create Translations for product
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
          //create Images for product
          const images = await Promise.all(
            Array.from({ length: 3 }).map(async (_, index) => {
              return await productImageRepository.save({
                productId: product.id,
                image: faker.image.url(),
                url: faker.image.url(),
                isMain: index === 0, // Solo la prima immagine sarà impostata come principale
              });
            }),
          );
          //create attributes values for product
          await Promise.all(
            categoryAttributes.map(async (attribute) => {
              return await productAttributeValueRepository.save({
                productId: product.id,
                attributeId: attribute.id,
                value: this.getRandomAttributeValue(attribute.name),
              });
            }),
          );
          product.translations = translations;
          product.images = images;
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

  private getRandomAttributeValue(attributeName: string): string {
    const valuesByAttribute = {
      Colore: ['Rosso', 'Blu', 'Verde', 'Nero', 'Bianco'],
      Dimensione: ['S', 'M', 'L', 'XL'],
      Materiale: ['Legno', 'Metallo', 'Plastica', 'Vetro'],
    };
    return faker.helpers.arrayElement(
      valuesByAttribute[attributeName as keyof typeof valuesByAttribute] || [
        'N/A',
      ],
    );
  }
  private getAttributeTranslation(
    attributeName: string,
    languageCode: string,
  ): string {
    const translations: Record<string, Record<string, string>> = {
      Colore: { it: 'Colore', en: 'Color' },
      Materiale: { it: 'Materiale', en: 'Material' },
      Dimensione: { it: 'Dimensione', en: 'Size' },
      Peso: { it: 'Peso', en: 'Weight' },
      Potenza: { it: 'Potenza', en: 'Power' },
      Tipo: { it: 'Tipo', en: 'Type' },
      Marca: { it: 'Marca', en: 'Brand' },
      Modello: { it: 'Modello', en: 'Model' },
      Anno: { it: 'Anno', en: 'Year' },
    };

    return translations[attributeName]?.[languageCode] || attributeName;
  }
}
