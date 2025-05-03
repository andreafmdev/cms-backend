import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductService } from '../../services/product.service';
import { GetProductCatalogResponseDto } from './get-product-catalog.response';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@shared/helpers/pagination.helper';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { GetProductCatalogQuery } from './get-product-catalog.query';
import { ProductCatalogFilterDto } from '../../dto/filter/product-catalog-filter.dto';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';

@QueryHandler(GetProductCatalogQuery)
export class GetProductCatalogHandler
  implements IQueryHandler<GetProductCatalogQuery>
{
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute(
    query: GetProductCatalogQuery,
  ): Promise<PaginatedResponseDto<GetProductCatalogResponseDto>> {
    let productsResults: GetProductCatalogResponseDto[] = [];
    let filters: Partial<ProductCatalogFilterDto> = {};

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
        const languageCode: LanguageCode = LanguageCode.create(
          query.languageCode ?? 'it',
        );
        const translation = product.getTranslation(languageCode);
        const categoryTranslation = category?.getTranslation(languageCode);
        return plainToInstance(GetProductCatalogResponseDto, {
          id: product.getId().toString(),
          name: translation.getName(),
          description: translation.getDescription(),
          price: product.getPrice(),
          isActive: product.IsActive(),
          brand: {
            id: brand?.getId().toString(),
            name: brand?.getName(),
          },
          category: {
            id: category?.getId().toString(),
            name: categoryTranslation?.getName(),
            description: categoryTranslation?.getDescription(),
          },
        });
      }),
    );

    const paginatedProducts: PaginatedResponseDto<GetProductCatalogResponseDto> =
      paginate<GetProductCatalogResponseDto>(
        productsResults,
        totalProducts,
        filters.page!,
        filters.limit!,
      );
    return paginatedProducts;
  }
}
