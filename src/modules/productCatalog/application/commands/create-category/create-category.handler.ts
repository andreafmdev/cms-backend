import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateCategoryCommand } from './create-category.command';
import { CreateCategoryResponseDto } from './create-category.response';
import { Category } from '@module/productCatalog/domain/aggregates/category';
import { ProductCategoryAttribute } from '@module/productCatalog/domain/entities/product-category-attribute';
import { ProductCategoryAttributeTranslation } from '@module/productCatalog/domain/entities/product-category-attribute-translation';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { CategoryTranslation } from '@module/productCatalog/domain/entities/category-translation';
import { CategoryService } from '../../services/category.service';
import { plainToInstance } from 'class-transformer';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler
  implements ICommandHandler<CreateCategoryCommand>
{
  constructor(private readonly categoryService: CategoryService) {}

  async execute(
    command: CreateCategoryCommand,
  ): Promise<CreateCategoryResponseDto> {
    const {
      categoryName,
      categoryDescription,
      languageCode,
      categoryAttributeName,
    } = command;
    let categoryResults: CreateCategoryResponseDto =
      new CreateCategoryResponseDto();
    const languageCodeValue = LanguageCode.create(languageCode);
    const translations: ProductCategoryAttributeTranslation[] = [
      ProductCategoryAttributeTranslation.create({
        value: categoryAttributeName,
        languageCode: languageCodeValue,
      }),
    ];
    const productCategoryAttribute = ProductCategoryAttribute.create({
      translations,
      categoryId: CategoryId.create(),
    });

    const categoryTranslations: CategoryTranslation[] = [
      CategoryTranslation.create({
        name: categoryName,
        description: categoryDescription,
        languageCode: languageCodeValue,
        categoryId: CategoryId.create(),
      }),
    ];
    const category = Category.create({
      attributes: [productCategoryAttribute],
      translations: [...categoryTranslations],
      id: CategoryId.create(),
    });
    const newCategory = await this.categoryService.createCategory(category);

    categoryResults = plainToInstance(CreateCategoryResponseDto, {
      id: newCategory.getId().toString(),
      category: newCategory.getAttributes().map((attribute) => ({
        id: attribute.getId().toString(),
        name: attribute.getTranslations().map((translation) => ({
          languageCode: languageCodeValue.getValue(),
          value: translation.getValue(),
        })),
        categoryAttributes: newCategory.getAttributes().map((attribute) => ({
          id: attribute.getId().toString(),
          name: attribute.getTranslations().map((translation) => ({
            languageCode: languageCodeValue.getValue(),
            value: translation.getValue(),
          })),
        })),
      })),
    });
    return categoryResults;
  }
}
