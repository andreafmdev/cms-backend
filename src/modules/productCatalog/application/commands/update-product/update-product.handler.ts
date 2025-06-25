import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UpdateProductCommand } from './update-product.command';
import { ProductService } from '../../services/product.service';
import { UpdateProductResponseDto } from './update-product.response';
import { UploadService } from '@module/upload/upload.service';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  async execute(
    command: UpdateProductCommand,
  ): Promise<UpdateProductResponseDto> {
    const {
      id,
      price,
      brandId,
      categoryId,
      isAvailable,
      isFeatured,
      translations,
      images,
      attributes,
    } = command;

    console.log('Update command:', { id, attributes });

    // Upload delle nuove immagini (se presenti)

    // Aggiorna il prodotto
    const product = await this.productService.updateProduct(id, {
      price,
      brandId,
      categoryId,
      isAvailable,
      isFeatured,
      translations,
      images: images.map((image) => image.idImage) ?? [],
      attributes,
    });

    const response = new UpdateProductResponseDto();
    response.success = true;

    return response;
  }
}
