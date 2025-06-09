import { MemoryStorageFile } from '@x6tech/nest-file-fastify';
import { ProductTranslationDto } from '../../dto/product-translation.dto';
import { ProductAttributeValueDto } from '../../dto/product-attribute-value.dto';

export class CreateProductCommand {
  constructor(
    public readonly price: number,
    public readonly brandId: string,
    public readonly categoryId: string,
    public readonly isAvailable: boolean,
    public readonly isFeatured: boolean,
    public readonly translations: ProductTranslationDto[],
    public readonly image: MemoryStorageFile[],
    public readonly attributes: ProductAttributeValueDto[],
  ) {}
}
