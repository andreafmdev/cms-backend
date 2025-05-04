import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@shared/helpers/pagination.helper';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { SearchBrandsQuery } from './search-brands.query';
import { BrandService } from '../../services/brand.service';
import { SearchBrandsResponseDto } from './search-brands.response';
@QueryHandler(SearchBrandsQuery)
export class SearchBrandsHandler implements IQueryHandler<SearchBrandsQuery> {
  constructor(private readonly brandService: BrandService) {}

  async execute(
    query: SearchBrandsQuery,
  ): Promise<PaginatedResponseDto<SearchBrandsResponseDto>> {
    let brandsResults: SearchBrandsResponseDto[] = [];
    const filters = query.filters;
    const [brands, totalBrands] = await Promise.all([
      this.brandService.searchBrands(filters),
      this.brandService.countSearchBrands(filters),
    ]);
    brandsResults = await Promise.all(
      brands.map((brand) => {
        return plainToInstance(SearchBrandsResponseDto, {
          id: brand.getId().toString(),
          name: brand.getName(),
        });
      }),
    );
    const paginatedBrands: PaginatedResponseDto<SearchBrandsResponseDto> =
      paginate<SearchBrandsResponseDto>(
        brandsResults,
        totalBrands,
        filters.page!,
        filters.limit!,
      );
    return paginatedBrands;
  }
}
