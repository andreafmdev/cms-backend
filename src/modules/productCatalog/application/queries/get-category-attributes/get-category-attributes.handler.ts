import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryAttributesQuery } from './get-category-attributes.query';
import { CategoryService } from '../../services/category.service';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { LanguageService } from '../../services/language.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { GetCategoryAttributeResponse } from './get-category-attribute.response';
@QueryHandler(GetCategoryAttributesQuery)
export class GetCategoryAttributesHandler
  implements IQueryHandler<GetCategoryAttributesQuery>
{
  constructor(
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
  ) {}

  async execute(
    query: GetCategoryAttributesQuery,
  ): Promise<GetCategoryAttributeResponse[]> {
    const categoryId = CategoryId.create(query.id);
    const languageCode = LanguageCode.create(query.languageCode);
    const activeLanguage =
      await this.languageService.findActiveLanguageByCode(languageCode);
    if (!activeLanguage) {
      throw new BadRequestException(
        `Language ${languageCode.getValue()} is not active`,
      );
    }
    const category = await this.categoryService.findCategoryById(categoryId);
    if (!category) {
      throw new NotFoundException(
        `Category ${categoryId.getStringValue()} not found`,
      );
    }
    const attributes = category.getAttributes();
    return plainToInstance(
      GetCategoryAttributeResponse,
      attributes.map((attribute) => ({
        id: attribute.getId().getStringValue(),
        name: attribute.getName(languageCode),
      })),
    );
  }
}
