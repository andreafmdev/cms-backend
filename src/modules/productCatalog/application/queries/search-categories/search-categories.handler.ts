import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@shared/helpers/pagination.helper';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { SearchCategoriesQuery } from './search-categories.query';
import { SearchCategoriesResponseDto } from './search-categories.response';
import { CategoryService } from '../../services/category.service';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { LanguageService } from '../../services/language.service';
import { NotFoundException } from '@nestjs/common';
@QueryHandler(SearchCategoriesQuery)
export class SearchCategoriesHandler
  implements IQueryHandler<SearchCategoriesQuery>
{
  constructor(
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
  ) {}

  async execute(
    query: SearchCategoriesQuery,
  ): Promise<PaginatedResponseDto<SearchCategoriesResponseDto>> {
    let categoriesResults: SearchCategoriesResponseDto[] = [];
    const filters = query.filters;
    const defaultLanguage = await this.languageService.findDefaultLanguage();
    if (!defaultLanguage) {
      throw new NotFoundException('Default language not found');
    }
    const serviceFilters = {
      ...filters,
      languageCode: filters.languageCode!,
    };
    const defaultLanguageCode = defaultLanguage.getCode().getValue();
    if (!serviceFilters.languageCode) {
      serviceFilters.languageCode = defaultLanguageCode;
    }

    const [categories, totalCategories] = await Promise.all([
      this.categoryService.searchCategories(serviceFilters),
      this.categoryService.searchCategoriesCount(serviceFilters),
    ]);
    const languageCode = LanguageCode.create(serviceFilters.languageCode);
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
