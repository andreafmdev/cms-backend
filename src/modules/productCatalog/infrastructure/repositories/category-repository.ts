import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@base/infrastructure/repositories/base.repository';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CategoryOrmEntity } from '@module/productCatalog/infrastructure/entities/category.orm-entity';
import { ICategoryRepository } from '@module/productCatalog/domain/repositories/category-repository.interface';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { CategoryMapper } from '../mapper/category-mapper';
import { ProductCategoryAttributeValueOrmEntity } from '../entities/product-category-attribute-value.orm-entity';
import { ProductCategoryAttributeOrmEntity } from '../entities/product-category-attribute.orm-entity';
import { ProductCategoryAttributeTranslationOrmEntity } from '../entities/product-category-attribute-translation.orm-entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
//custom type
interface AttributeWithValue {
  attributeId: string;
  attributeName: string;
  attributeValue: string;
}
@Injectable()
export class CategoryRepository
  extends BaseRepository<Category, CategoryOrmEntity, CategoryId>
  implements ICategoryRepository
{
  constructor(
    @InjectRepository(CategoryOrmEntity)
    @InjectDataSource()
    repo: Repository<CategoryOrmEntity>,
    mapper: CategoryMapper,
    private readonly dataSource: DataSource,
  ) {
    super(repo, mapper);
  }
  /**
   * Find a product by its ID
   * @param id - The ID of the product to find
   * @returns The product domain entity if found, otherwise null (Product | null)
   */
  async findCategoryById(id: CategoryId): Promise<Category | null> {
    const categoryOrm = await super.findById(id);
    return categoryOrm;
  }
  /**
   * Create a new category
   * @param category - The category domain entity to create
   * @returns The created category domain entity
   */
  async createCategory(category: Category): Promise<Category> {
    const createdCategoryOrm = await super.save(category);
    return createdCategoryOrm;
  }
  /**
   * Find all categories
   * @returns The category domain entities (Category[])
   */
  async findAllCategories(): Promise<Category[]> {
    const categoryOrms = await super.findAll();
    return categoryOrms;
  }
  /**
   * Find all categories by translation name and language code
   * @param name - The name of the category to find
   * @param languageCode - The language code of the category to find
   * @returns The category domain entities if found, otherwise an empty array (Category[])
   */
  async findAllByTranslationNameAndLanguage(
    name?: string,
    languageCode?: string,
  ): Promise<Category[]> {
    const query = this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation');

    if (name) {
      query.andWhere('translation.name LIKE :name', { name: `%${name}%` });
    }
    if (languageCode) {
      query.andWhere('translation.languageCode = :languageCode', {
        languageCode,
      });
    }

    const ormEntities = await query.getMany();
    return ormEntities.map((orm) => this.mapper.toDomain(orm));
  }
  /**
   * Find a category by its name and language code
   * @param name - The name of the category to find
   * @param languageCode - The language code of the category to find
   * @param id - The ID of the category to exclude from the search
   * @returns The category domain entity if found, otherwise null (Category | null)
   */
  async findExistingCategoryTranslation(
    name: string,
    languageCode: string,
    id: string,
  ): Promise<Category | null> {
    const categoryOrm = await this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation')
      .leftJoinAndSelect('category.attributes', 'attribute')
      .leftJoinAndSelect('attribute.translations', 'attributeTranslation')
      .where('LOWER(translation.name) LIKE LOWER(:name)', { name: `%${name}%` })
      .andWhere('translation.languageCode = :languageCode', { languageCode })
      .andWhere('category.id != :id', { id: id })
      .getOne();

    return categoryOrm ? this.mapper.toDomain(categoryOrm) : null;
  }

  async searchCategories(filters: {
    name?: string;
    languageCode: string;
    page?: number;
    limit?: number;
  }): Promise<Category[]> {
    const query = this.buildSearchQuery(filters);
    const limit = filters.limit ?? process.env.DEFAULT_LIMIT;
    const page = filters.page ?? process.env.DEFAULT_PAGE;
    const safePage = Math.max(1, Number(page) || 1); // assicura che sia almeno 1
    const safeLimit = Math.max(1, Number(limit) || 10); // assicura che sia almeno 1
    query.skip((safePage - 1) * safeLimit).take(safeLimit);
    const ormEntities = await query.getMany();
    return ormEntities.map((orm) => this.mapper.toDomain(orm));
  }
  async searchCategoriesCount(filters: {
    name?: string;
    languageCode: string;
  }): Promise<number> {
    const query = this.buildSearchQuery(filters);
    return await query.getCount();
  }
  /**
   * Find product category attributes with values
   * @param productId - The ID of the product to find
   * @param languageCode - The language code of the category to find
   * @returns The product category attributes with values (AttributeWithValue[])
   */
  async findProductCategoryAttributesWithValues(
    productId: string,
    languageCode: string,
  ): Promise<AttributeWithValue[]> {
    const results = await this.dataSource
      .getRepository(ProductCategoryAttributeValueOrmEntity)
      .createQueryBuilder('value')
      .innerJoin('value.attribute', 'attribute')
      .innerJoin(
        'attribute.translations',
        'translation',
        'translation.languageCode = :lang',
        { lang: languageCode },
      )
      .where('value.productId = :productId', { productId })
      .select([
        'attribute.id AS "attributeId"',
        'translation.value AS "attributeName"',
        'value.value AS "attributeValue"',
      ])
      .getRawMany<AttributeWithValue>();

    return results;
  }
  /**
   * Find all product category attributes
   * @param productId - The ID of the product to find
   * @param languageCode - The language code of the category to find
  
   * @returns The product category attributes with values and if they have a value (AttributeWithValue & { hasValue: boolean }[])
   */
  async findAllProductsAttributesInCategory(
    productId: string,
    languageCode: string,
  ) {
    const results = await this.dataSource
      .createQueryBuilder()
      .select([
        'catAttr.id AS "attributeId"',
        'translation.value AS "attributeName"',
        'prodValues.value AS "attributeValue"',
        'CASE WHEN prodValues.value IS NOT NULL THEN true ELSE false END AS "hasValue"',
      ])
      .from(ProductOrmEntity, 'product')
      .innerJoin(
        ProductCategoryAttributeOrmEntity,
        'catAttr',
        'product.categoryId = catAttr.categoryId',
      )
      .innerJoin(
        ProductCategoryAttributeTranslationOrmEntity,
        'translation',
        'catAttr.id = translation.attributeId',
      )
      .leftJoin(
        ProductCategoryAttributeValueOrmEntity,
        'prodValues',
        'catAttr.id = prodValues.attributeId AND prodValues.productId = product.id',
      )
      .where('translation.languageCode = :lang', { lang: languageCode })
      .andWhere('product.id = :productId', { productId })
      .orderBy('catAttr.id')
      .getRawMany<AttributeWithValue & { hasValue: boolean }>();

    return results;
  }
  async removeAttributeById(attributeId: string): Promise<void> {
    await this.dataSource
      .getRepository(ProductCategoryAttributeOrmEntity)
      .delete(attributeId);
  }
  async removeAllAttributesByCategoryId(categoryId: string): Promise<void> {
    await this.dataSource
      .getRepository(ProductCategoryAttributeOrmEntity)
      .delete({ categoryId });
  }
  /*HELPERS*/
  /**
   * Build a search query for categories
   * @param filters - The filters to apply to the query
   * @returns The built query (SelectQueryBuilder)
   */
  private buildSearchQuery(filters: { name?: string; languageCode: string }) {
    const query = this.repository.createQueryBuilder('categories');
    query.innerJoinAndSelect(
      'categories.translations',
      'translation',
      'translation.languageCode = :languageCode',
      { languageCode: filters.languageCode },
    );
    query.leftJoinAndSelect('categories.attributes', 'attribute');
    query.leftJoinAndSelect(
      'attribute.translations',
      'attributeTranslation',
      'attributeTranslation.languageCode = :languageCode',
      { languageCode: filters.languageCode },
    );

    if (filters.name) {
      query.andWhere('translation.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    //query.orderBy('categories.updated_at', 'DESC');
    //query.addOrderBy('categories.created_at', 'DESC');

    return query;
  }
}
