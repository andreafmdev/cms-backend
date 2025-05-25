import { CategoryTranslationDto } from '../../dto/category-translation.dto';
import { CategoryAttributeDto } from '../../dto/category-attribute.dto';
export class UpdateCategoryCommand {
  constructor(
    public readonly translations: CategoryTranslationDto[],
    public readonly attributes: CategoryAttributeDto[],
    public readonly id: string, //category id
  ) {}
}
