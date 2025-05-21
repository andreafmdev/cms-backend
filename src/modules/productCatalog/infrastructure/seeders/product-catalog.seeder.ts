import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { BrandOrmEntity } from '@module/productCatalog/infrastructure/entities/brand.orm-entity';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { ProductTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-translation.orm-entity';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { CategoryTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/category-translation.orm-entity';
import { ProductCategoryAttributeOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute.orm-entity';
import { ProductCategoryAttributeValueOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-value.orm-entity';
import { ProductCategoryAttributeTranslationOrmEntity } from '@module/productCatalog/infrastructure/entities/product-category-attribute-translation.orm-entity';
import { ProductImageOrmEntity } from '@module/productCatalog/infrastructure/entities/product-image.orm-entity';
import { LanguageOrmEntity } from '@module/productCatalog/infrastructure/entities/language.orm-entity';

export default class ProductCatalogSeeder implements Seeder {
  private readonly logger = new Logger(ProductCatalogSeeder.name);
  private readonly SUPPORTED_LANGUAGES = [
    { code: 'it', description: 'Italiano' },
    { code: 'en', description: 'English' },
  ];

  public async run(dataSource: DataSource): Promise<void> {
    const brandRepository = dataSource.getRepository(BrandOrmEntity);
    const categoryRepository = dataSource.getRepository(CategoryOrmEntity);
    const languageRepository = dataSource.getRepository(LanguageOrmEntity);
    const categoryTranslationRepository = dataSource.getRepository(
      CategoryTranslationOrmEntity,
    );
    const productAttributeRepository = dataSource.getRepository(
      ProductCategoryAttributeOrmEntity,
    );
    const productAttributeTranslationRepository = dataSource.getRepository(
      ProductCategoryAttributeTranslationOrmEntity,
    );
    const productAttributeValueRepository = dataSource.getRepository(
      ProductCategoryAttributeValueOrmEntity,
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
      //create languages
      await Promise.all(
        this.SUPPORTED_LANGUAGES.map(async (languageCode) => {
          return await languageRepository.save({
            code: languageCode.code,
            name: languageCode.description,
            isActive: true,
            isDefault: languageCode.code === 'it',
          });
        }),
      );
      const supportedLanguagesOrmEntities = await this.getLanguages(dataSource);
      this.logger.log('🚀 Starting ProductCatalogSeeder...');

      // 1. create brands
      this.logger.log('⚙️ Creating brands...');
      const brandsObject = {
        Steinway: {
          name: 'Steinway',
          description:
            'Steinway & Sons è un produttore di pianoforti di lusso fondato nel 1853, noto per la qualità artigianale e il suono eccezionale dei suoi strumenti.',
        },
        Yamaha: {
          name: 'Yamaha',
          description:
            'Yamaha Corporation è un azienda giapponese che produce una vasta gamma di strumenti musicali, inclusi pianoforti di alta qualità apprezzati per la loro affidabilità e versatilità.',
        },
        Fazioli: {
          name: 'Fazioli',
          description:
            'Fazioli è un produttore italiano di pianoforti a coda di altissima gamma, fondato nel 1981 da Paolo Fazioli, che combina tecnologia innovativa con artigianato tradizionale.',
        },
      };
      const brandsToCreate = Object.keys(brandsObject).map((key) => ({
        name: key,
        id: faker.string.uuid(),
        description: brandsObject[key as keyof typeof brandsObject].description,
      }));
      const brands = await brandRepository.save(brandsToCreate);
      this.logger.log(`✅ Created ${brands.length} brands`);

      // 2. create categories with translations
      this.logger.log('⚙️ creating categories with translations...');
      const categoriesObject = this.buildCategoryTranslation();
      const categories = await Promise.all(
        Object.keys(categoriesObject).map(async (key) => {
          // Crea la categoria
          const categoryId = faker.string.uuid();
          const category = await categoryRepository.save({
            id: categoryId,
          });

          // Crea le traduzioni per la categoria
          await Promise.all(
            supportedLanguagesOrmEntities.map(async (lang) => {
              const categoryTranslation = categoriesObject[key][lang.code];
              return await categoryTranslationRepository.save({
                categoryId: category.id,
                languageCode: lang.code,
                name: categoryTranslation.name,
                description: categoryTranslation.description,
              });
            }),
          );
          // Crea attributi per la categoria
          const attributeNames = [
            faker.helpers.arrayElement(['Colore', 'Numero Tasti']),
            faker.helpers.arrayElement(['Peso', 'Anno']),
            faker.helpers.arrayElement(['Marca', 'Materiale']),
          ];

          // Crea gli attributi per la categoria
          await Promise.all(
            attributeNames.map(async (attributeName) => {
              const categoryAttributeId = faker.string.uuid();
              const attribute = await productAttributeRepository.save({
                id: categoryAttributeId,
                categoryId: category.id,
              });

              // Crea le traduzioni per l'attributo
              await Promise.all(
                supportedLanguagesOrmEntities.map(async (lang) => {
                  return await productAttributeTranslationRepository.save({
                    attributeId: attribute.id,
                    languageCode: lang.code,
                    value: this.getAttributeTranslation(
                      attributeName,
                      lang.code,
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
          const productId = faker.string.uuid();
          const product = await productRepository.save({
            id: productId,
            price: Number(faker.commerce.price({ min: 10, max: 1000 })),
            isAvailable: faker.datatype.boolean(),
            brandId: faker.helpers.arrayElement(brands).id,
            categoryId: selectedCategory.id,
          });

          // Create Translations for product
          const translations = await Promise.all(
            supportedLanguagesOrmEntities.map(async (lang) => {
              return await productTranslationRepository.save({
                productId: product.id,
                languageCode: lang.code,
                name: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
              });
            }),
          );
          //create Images for product
          const images = await Promise.all(
            Array.from({ length: 3 }).map(async (_, index) => {
              return await productImageRepository.save({
                id: faker.string.uuid(),
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
                value: faker.commerce.productAdjective(),
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
      NumeroTasti: { it: 'Numero Tasti', en: 'Number of Keys' },
    };

    return translations[attributeName]?.[languageCode] || attributeName;
  }
  private buildCategoryTranslation(): Record<
    string,
    Record<string, { name: string; description: string }>
  > {
    const categoryTranslations: Record<
      string,
      Record<string, { name: string; description: string }>
    > = {
      Pianoforti: {
        it: {
          name: 'Pianoforti',
          description: 'I pianoforti sono strumenti musicali a corde percosse.',
        },
        en: {
          name: 'Pianoforti',
          description: 'Pianos are stringed musical instruments.',
        },
      },
      Tastiere: {
        it: {
          name: 'Tastiere',
          description: 'Le tastiere sono strumenti musicali elettronici.',
        },
        en: {
          name: 'Keyboards',
          description: 'Keyboards are electronic musical instruments.',
        },
      },
      Chitarre: {
        it: {
          name: 'Chitarre',
          description: 'Le chitarre sono strumenti musicali a corde perse.',
        },
        en: {
          name: 'Guitars',
          description: 'Guitars are stringed musical instruments.',
        },
      },
      Violini: {
        it: {
          name: 'Violini',
          description: 'Le violini sono strumenti musicali a corde perse.',
        },
        en: {
          name: 'Violins',
          description: 'Violins are stringed musical instruments.',
        },
      },
    };
    return categoryTranslations;
  }

  private async getLanguages(
    dataSource: DataSource,
  ): Promise<LanguageOrmEntity[]> {
    const languageRepository = dataSource.getRepository(LanguageOrmEntity);
    const languages = await languageRepository.find();
    return languages;
  }
}
