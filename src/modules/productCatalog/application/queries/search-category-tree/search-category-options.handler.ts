import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '../../services/category.service';
import { SearchCategoryOptionsQuery } from './search-category-options.query';
import { SearchCategoryOptionsResponse } from './search-category-options.response';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { LanguageService } from '../../services/language.service';
import { NotFoundException } from '@nestjs/common';
@QueryHandler(SearchCategoryOptionsQuery)
export class SearchCategoryOptionsHandler
  implements IQueryHandler<SearchCategoryOptionsQuery>
{
  constructor(
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
  ) {}

  async execute(
    query: SearchCategoryOptionsQuery,
  ): Promise<SearchCategoryOptionsResponse[]> {
    let categoriesResults: SearchCategoryOptionsResponse[] = [];
    const defaultLanguage = await this.languageService.findDefaultLanguage();
    if (!defaultLanguage) {
      throw new NotFoundException('Default language not found');
    }
    const defaultLanguageCode = defaultLanguage.getCode().getValue();
    const categories =
      await this.categoryService.findCategoriesByTranslationNameAndLanguage({
        name: query.name,
        languageCode: defaultLanguageCode,
      });
    const languageCode = LanguageCode.create(defaultLanguageCode);
    categoriesResults = plainToInstance(
      SearchCategoryOptionsResponse,
      categories.map((category) => {
        return {
          id: category.getId().toString(),
          name: category.getTranslation(languageCode).getName(),
        };
      }),
    );

    return categoriesResults;
  }
}
