import { GetProductsQuery } from '@productCatalogModule/application/queries/get-products/get-products.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductService } from '../../services/product.service';
import { GetProductsResponseDto } from './get-products.response';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@shared/helpers/pagination.helper';
import { ProductFilterDto } from '../../dto/filter/product-filter.dto';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute(
    query: GetProductsQuery,
  ): Promise<PaginatedResponseDto<GetProductsResponseDto>> {
    let productsResults: GetProductsResponseDto[] = [];
    let filters: Partial<ProductFilterDto> = {};
    if (query.filters) {
      const { page, limit, ...where } = query.filters;
      filters = { page, limit, ...where };
    }
    const [products, totalProducts] = await Promise.all([
      this.productService.findProductsByFilters(filters),
      this.productService.countProductsByFilters(filters),
    ]);
    productsResults = await Promise.all(
      products.map(async (product) => {
        const brand = await this.brandService.findBrandById(
          product.getBrandId(),
        );
        const category = await this.categoryService.findCategoryById(
          product.getCategoryId(),
        );

        return plainToInstance(GetProductsResponseDto, {
          id: product.getId().toString(),
          price: product.getPrice(),
          isAvailable: product.IsAvailable(),
          isFeatured: product.IsFeatured(),
          translations: product.getTranslations().map((translation) => ({
            name: translation.getName(),
            description: translation.getDescription(),
            languageCode: translation.getLanguageCode().getValue(),
          })),
          brand: {
            id: brand?.getId().toString(),
            name: brand?.getName(),
          },
          category: {
            id: category?.getId().toString(),
            translations: category?.getTranslations().map((translation) => ({
              name: translation.getName(),
              languageCode: translation.getLanguageCode().getValue(),
            })),
          },
        });
      }),
    );

    const paginatedProducts: PaginatedResponseDto<GetProductsResponseDto> =
      paginate<GetProductsResponseDto>(
        productsResults,
        totalProducts,
        filters.page!,
        filters.limit!,
      );
    return paginatedProducts;
  }
}
