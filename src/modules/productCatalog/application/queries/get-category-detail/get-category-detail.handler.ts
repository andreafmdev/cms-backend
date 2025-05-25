import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCategoryDetailQuery } from './get-category-detail.query';
import { CategoryService } from '../../services/category.service';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { plainToInstance } from 'class-transformer';
import { GetCategoryDetailResponseDto } from './get-category-detail.response';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { LanguageService } from '@module/productCatalog/application/services/language.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@QueryHandler(GetCategoryDetailQuery)
export class GetCategoryDetailHandler
  implements IQueryHandler<GetCategoryDetailQuery>
{
  constructor(
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
  ) {}

  async execute(
    query: GetCategoryDetailQuery,
  ): Promise<GetCategoryDetailResponseDto> {
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
    return plainToInstance(GetCategoryDetailResponseDto, {
      id: category?.getId().toString(),
      name: category?.getName(languageCode),
      description: category?.getDescription(languageCode),
      attributes: category?.getAttributes().map((el) => ({
        id: el.getId().toString(),
        name: el.getName(languageCode),
      })),
    });
  }
}
