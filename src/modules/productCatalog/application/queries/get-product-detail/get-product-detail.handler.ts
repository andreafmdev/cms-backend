import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductService } from '../../services/product.service';
import { ProductId } from '@module/productCatalog/domain/value-objects/product-id';
import { plainToInstance } from 'class-transformer';
import { LanguageCode } from '@module/productCatalog/domain/value-objects/language-code';
import { GetProductDetailResponseDto } from './get-product-detail.response';
import { GetProductDetailQuery } from './get-product-detail.query';
import { NotFoundException } from '@nestjs/common';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
@QueryHandler(GetProductDetailQuery)
export class GetProductDetailHandler
  implements IQueryHandler<GetProductDetailQuery>
{
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
  ) {}

  async execute(
    query: GetProductDetailQuery,
  ): Promise<GetProductDetailResponseDto> {
    const productId = ProductId.create(query.id);
    const languageCode = LanguageCode.create(query.languageCode);
    const product = await this.productService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const translation = product.getTranslation(languageCode);
    const brand = await this.brandService.findBrandById(product.getBrandId());
    const category = await this.categoryService.findCategoryById(
      product.getCategoryId(),
    );

    const productAttributes =
      await this.productService.findProductCategoryAttributesWithValues(
        product.getId(),
        languageCode.getValue(),
      );
    return plainToInstance(GetProductDetailResponseDto, {
      id: product.getId().toString(),
      name: translation.getName(),
      isActive: product.IsActive(),
      description: translation.getDescription(),
      price: product.getPrice(),
      brand: {
        id: brand?.getId().toString(),
        name: brand?.getName(),
      },
      attributes: productAttributes.length > 0 ? productAttributes : [],
      category: {
        id: category?.getId().toString(),
        name: category?.getName(languageCode),
        attributes: category?.getAttributes().map((attribute) => ({
          id: attribute.getId().toString(),
          name: attribute.getName(languageCode),
        })),
      },
    });
  }
}
