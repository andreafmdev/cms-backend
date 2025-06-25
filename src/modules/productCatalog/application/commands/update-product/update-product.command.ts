import { ProductTranslationDto } from '../../dto/product-translation.dto';
import { ProductAttributeValueDto } from '../../dto/product-attribute-value.dto';
import { ProductImageDto } from '../../dto/product-image.dto';

export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly price: number,
    public readonly brandId: string,
    public readonly categoryId: string,
    public readonly isAvailable: boolean,
    public readonly isFeatured: boolean,
    public readonly translations: ProductTranslationDto[],
    public readonly images: ProductImageDto[],
    public readonly attributes: ProductAttributeValueDto[],
  ) {}
}
