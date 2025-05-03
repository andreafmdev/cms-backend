import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductService } from '../../services/product.service';
import { plainToInstance } from 'class-transformer';
import { CategoryService } from '../../services/category.service';
import { BrandService } from '../../services/brand.service';
import { SearchCategoriesTreeQuery } from './search-categories-tree.query';
import { SearchCategoriesTreeResponse } from './search-categories-tree.response';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
@QueryHandler(SearchCategoriesTreeQuery)
export class SearchCategoriesTreeHandler
  implements IQueryHandler<SearchCategoriesTreeQuery>
{
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute(
    query: SearchCategoriesTreeQuery,
  ): Promise<SearchCategoriesTreeResponse[]> {
    let categoriesResults: SearchCategoriesTreeResponse[] = [];

    const categories =
      await this.categoryService.findCategoriesByTranslationNameAndLanguage({
        name: query.name,
        languageCode: query.languageCode,
      });
    const languageCode = LanguageCode.create(query.languageCode!);
    categoriesResults = plainToInstance(
      SearchCategoriesTreeResponse,
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
