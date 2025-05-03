import { Product } from '@module/productCatalog/domain/aggregates/product';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { ProductOrmEntity } from '@module/productCatalog/infrastructure/entities/product.orm-entity';
import { ProductRepository } from '@module/productCatalog/infrastructure/repositories/product-repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';
import { ProductFilterDto } from '../dto/filter/product-filter.dto';
import { ProductTranslationDto } from '../dto/product-translation.dto';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { BrandId } from '@module/productCatalog/domain/value-objects/brand-id';
import { ProductTranslation } from '@module/productCatalog/domain/entities/product-translation';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { ProductImage } from '@module/productCatalog/domain/entities/product-image';
import { ImageUrl } from '@module/productCatalog/domain/value-objects/image-url';
import { BrandRepository } from '@module/productCatalog/infrastructure/repositories/brand-repository';
import { CategoryRepository } from '@module/productCatalog/infrastructure/repositories/category-repository';
interface ProductFilter extends FindOptionsWhere<ProductOrmEntity> {
  page?: number;
  limit?: number;
}
@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findProductById(id: ProductId): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }
  async findAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
  async countProductsByFilters(
    filters: Partial<ProductFilterDto>,
  ): Promise<number> {
    return this.productRepository.count(filters);
  }
  async findProductsByFilters(filters: ProductFilter): Promise<Product[]> {
    const { page, limit, ...whereFilters } = filters;

    const products = await this.productRepository.findAllByCondition({
      filters: whereFilters as FindOptionsWhere<ProductOrmEntity>,
      pagination: {
        page: page,
        limit: limit,
      },
    });
    return products;
  }
  /**
   * Create a new product
   * @param props - The properties of the product
   * @param props.price - The price of the product
   * @param props.image - The image of the product
   * @param props.brandId - The brand id of the product
   * @param props.categoryId - The category id of the product
   * @param props.isActive - The active status of the product
   * @param props.translations - The translations of the product
   * @param props.translations.languageCode - The language code of the translation
   * @param props.translations.name - The name of the translation
   * @param props.translations.description - The description of the translation
   * @returns The created product
   */
  async createProduct(props: {
    price: number;
    image: string[];
    translations: ProductTranslationDto[];
    brandId: string;
    categoryId: string;
    isActive: boolean;
  }): Promise<Product> {
    const productId = ProductId.create();

    const brand = await this.brandRepository.findById(
      BrandId.create(props.brandId),
    );
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const category = await this.categoryRepository.findById(
      CategoryId.create(props.categoryId),
    );
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const productBrandId = BrandId.create(props.brandId);
    const productCategoryId = CategoryId.create(props.categoryId);
    const productTranslations = props.translations.map((translation) =>
      ProductTranslation.create({
        languageCode: LanguageCode.create(translation.languageCode),
        name: translation.name,
        description: translation.description,
        productId,
      }),
    );
    const productImage = props.image.map((image) =>
      ProductImage.create({
        url: ImageUrl.create(image),
        isMain: false,
      }),
    );
    const product = Product.create({
      id: productId,
      price: props.price,
      brandId: productBrandId,
      categoryId: productCategoryId,
      translations: productTranslations,
      image: productImage.length > 0 ? productImage : [],
      attributesValues: [],
      isAvailable: props.isActive,
    });
    return await this.productRepository.save(product);
  }
  async searchProducts(filters: {
    name?: string;
    categoryId?: string;
    brandId?: string;
    price?: number;
    isActive?: boolean;
    languageCode?: string;
    page?: number;
    limit?: number;
  }): Promise<Product[]> {
    return this.productRepository.searchProducts(filters);
  }
  async searchProductsCount(filters: {
    name?: string;
    categoryId?: string;
    brandId?: string;
    price?: number;
    isActive?: boolean;
  }): Promise<number> {
    return this.productRepository.searchProductsCount(filters);
  }
}
