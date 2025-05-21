import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductService } from '../../services/product.service';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@shared/helpers/pagination.helper';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { SearchProductsQuery } from './search-products.query';
import { SearchProductsResponseDto } from './search-products.response';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { LanguageService } from '../../services/language.service';
import { NotFoundException } from '@nestjs/common';
@QueryHandler(SearchProductsQuery)
export class SearchProductsHandler
  implements IQueryHandler<SearchProductsQuery>
{
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
  ) {}

  async execute(
    query: SearchProductsQuery,
  ): Promise<PaginatedResponseDto<SearchProductsResponseDto>> {
    let productsResults: SearchProductsResponseDto[] = [];
    const filters = query.filters;
    const defaultLanguage = await this.languageService.findDefaultLanguage();
    if (!defaultLanguage) {
      throw new NotFoundException('Default language not found');
    }
    const defaultLanguageCode = defaultLanguage.getCode().getValue();
    filters.languageCode = defaultLanguageCode;
    const [products, totalProducts] = await Promise.all([
      this.productService.searchProducts(filters),
      this.productService.searchProductsCount(filters),
    ]);
    const languageCode = LanguageCode.create(defaultLanguageCode);
    productsResults = await Promise.all(
      products.map(async (product) => {
        const brand = await this.brandService.findBrandById(
          product.getBrandId(),
        );
        const category = await this.categoryService.findCategoryById(
          product.getCategoryId(),
        );
        return plainToInstance(SearchProductsResponseDto, {
          id: product.getId().toString(),
          name: product.getTranslation(languageCode).getName(),
          price: product.getPrice(),
          description: product.getTranslation(languageCode).getDescription(),
          isAvailable: product.IsAvailable(),
          isFeatured: product.IsFeatured(),
          brand: {
            id: brand?.getId().toString(),
            name: brand?.getName(),
          },
          category: {
            id: category?.getId().toString(),
            name: category?.getTranslation(languageCode).getName(),
            attributes: category?.getAttributes().map((attribute) => ({
              name: attribute.getTranslation(languageCode).getValue(),
            })),
          },
        });
      }),
    );
    const paginatedProducts: PaginatedResponseDto<SearchProductsResponseDto> =
      paginate<SearchProductsResponseDto>(
        productsResults,
        totalProducts,
        filters.page!,
        filters.limit!,
      );
    return paginatedProducts;
  }
}
