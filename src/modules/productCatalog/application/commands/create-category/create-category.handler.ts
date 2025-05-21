import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateCategoryCommand } from './create-category.command';
import { CreateCategoryResponseDto } from './create-category.response';
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
    const { translations, attributes } = command;
    const category = await this.categoryService.createCategory({
      translations: translations,
      attributeTranslations: attributes,
    });
    return plainToInstance(CreateCategoryResponseDto, {
      id: category.getId().toString(),
    });
  }
}
