import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@shared/helpers/pagination.helper';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { SearchCategoriesQuery } from './search-categories.query';
import { SearchCategoriesResponseDto } from './search-categories.response';
import { CategoryService } from '../../services/category.service';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
@QueryHandler(SearchCategoriesQuery)
export class SearchCategoriesHandler
  implements IQueryHandler<SearchCategoriesQuery>
{
  constructor(private readonly categoryService: CategoryService) {}

  async execute(
    query: SearchCategoriesQuery,
  ): Promise<PaginatedResponseDto<SearchCategoriesResponseDto>> {
    let categoriesResults: SearchCategoriesResponseDto[] = [];
    const filters = query.filters;
    const [categories, totalCategories] = await Promise.all([
      this.categoryService.searchCategories(filters),
      this.categoryService.searchCategoriesCount(filters),
    ]);
    const languageCode = LanguageCode.create(filters.languageCode ?? 'it');
    categoriesResults = await Promise.all(
      categories.map((category) => {
        return plainToInstance(SearchCategoriesResponseDto, {
          id: category.getId().toString(),
          name: category.getTranslation(languageCode).getName(),
          description: category.getTranslation(languageCode).getDescription(),
          attributes: category.getAttributes().map((attribute) => ({
            id: attribute.getId().toString(),
            name: attribute.getTranslation(languageCode).getValue(),
          })),
        });
      }),
    );
    const paginatedCategories: PaginatedResponseDto<SearchCategoriesResponseDto> =
      paginate<SearchCategoriesResponseDto>(
        categoriesResults,
        totalCategories,
        filters.page!,
        filters.limit!,
      );
    return paginatedCategories;
  }
}
