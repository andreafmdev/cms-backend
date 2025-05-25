import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCategoryCommand } from './update-category.command';
import { CategoryService } from '../../services/category.service';
import { Injectable } from '@nestjs/common';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';

@Injectable()
@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(private readonly categoryService: CategoryService) {}

  async execute(command: UpdateCategoryCommand) {
    const { id, translations, attributes } = command;

    const categoryId = CategoryId.create(id);
    return await this.categoryService.updateCategory(categoryId, {
      categoryTranslations: translations,
      attributes: attributes,
    });
  }
}
