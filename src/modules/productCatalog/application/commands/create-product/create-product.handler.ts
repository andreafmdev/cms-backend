import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateProductCommand } from './create-product.command';
import { ProductService } from '@module/productCatalog/application/services/product.service';
import { CreateProductResponseDto } from './create-product.response';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(private readonly productService: ProductService) {}

  async execute(
    command: CreateProductCommand,
  ): Promise<CreateProductResponseDto> {
    const productResponse = new CreateProductResponseDto();
    const { price, brandId, categoryId, isActive, translations, image } =
      command;
    const product = await this.productService.createProduct({
      price,
      image,
      translations,
      brandId,
      categoryId,
      isActive,
    });

    productResponse.id = product.getId().toString();
    return productResponse;
  }
}
