import { ProductTranslationDto } from '../../dto/product-translation.dto';

export class CreateProductCommand {
  constructor(
    public readonly price: number,
    public readonly brandId: string,
    public readonly categoryId: string,
    public readonly isActive: boolean,
    public readonly translations: ProductTranslationDto[],
    public readonly image: string[],
  ) {}
}
