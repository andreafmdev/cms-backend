import { CategoryAttributeDto } from '../../dto/category-attribute.dto';
import { CategoryTranslationDto } from '../../dto/category-translation.dto';

// application/commands/create-user.command.ts
export class CreateCategoryCommand {
  constructor(
    public readonly translations: CategoryTranslationDto[],
    public readonly attributes: CategoryAttributeDto[],
  ) {}
}
