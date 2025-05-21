import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeleteCategoryCommand } from './delete-category.command';
import { CategoryService } from '../../services/category.service';
import { CategoryId } from '@module/productCatalog/domain/value-objects/category-id';
import { DeleteCategoryResponse } from './delete-category.response';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler
  implements ICommandHandler<DeleteCategoryCommand>
{
  constructor(private readonly categoryService: CategoryService) {}

  async execute(
    command: DeleteCategoryCommand,
  ): Promise<DeleteCategoryResponse> {
    const categoryId = CategoryId.create(command.id);
    const isDeleted = await this.categoryService.deleteCategory(categoryId);
    return {
      success: isDeleted,
      message: isDeleted
        ? 'Category deleted successfully'
        : 'Error deleting category',
    };
  }
}
