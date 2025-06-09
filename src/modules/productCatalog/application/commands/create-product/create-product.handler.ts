import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateProductCommand } from './create-product.command';
import { ProductService } from '@module/productCatalog/application/services/product.service';
import { CreateProductResponseDto } from './create-product.response';
import { UploadService } from '@module/upload/upload.service';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  async execute(
    command: CreateProductCommand,
  ): Promise<CreateProductResponseDto> {
    const productResponse = new CreateProductResponseDto();
    const {
      price,
      brandId,
      categoryId,
      isAvailable,
      isFeatured,
      translations,
      image,
      attributes,
    } = command;
    console.log(attributes);
    const imageUrls: { url: string; publicId: string }[] = await Promise.all(
      image.map((file) =>
        this.uploadService.uploadImageBuffer(
          file.buffer,
          file.originalFilename,
        ),
      ),
    );
    const product = await this.productService.createProduct({
      price,
      image: imageUrls.map((url) => url.url),
      translations,
      brandId,
      categoryId,
      isAvailable,
      isFeatured,
      attributes,
    });

    productResponse.id = product.getId().toString();
    return productResponse;
  }
}
