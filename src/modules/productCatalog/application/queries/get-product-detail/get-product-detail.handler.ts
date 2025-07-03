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
import { LanguageService } from '../../services/language.service';
@QueryHandler(GetProductDetailQuery)
export class GetProductDetailHandler
  implements IQueryHandler<GetProductDetailQuery>
{
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly categoryService: CategoryService,
    private readonly languageService: LanguageService,
  ) {}

  async execute(
    query: GetProductDetailQuery,
  ): Promise<GetProductDetailResponseDto> {
    const productId = ProductId.create(query.id);
    const defaultLanguage = await this.languageService.findDefaultLanguage();
    if (!defaultLanguage) {
      throw new NotFoundException('Default language not found');
    }
    const defaultLanguageCode = defaultLanguage.getCode().getValue();
    const languageCode = LanguageCode.create(defaultLanguageCode);
    const product = await this.productService.findProductById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const brand = await this.brandService.findBrandById(product.getBrandId());
    const category = await this.categoryService.findCategoryById(
      product.getCategoryId(),
    );
    const images = product.getProductImagesOrdered();

    const productAttributes =
      await this.productService.findProductCategoryAttributes(
        product.getId(),
        languageCode.getValue(),
      );
    return plainToInstance(GetProductDetailResponseDto, {
      id: product.getId().toString(),
      translations: product.getTranslations().map((translation) => ({
        languageCode: translation.getLanguageCode().getValue(),
        name: translation.getName(),
        description: translation.getDescription(),
      })),
      isAvailable: product.IsAvailable(),
      isFeatured: product.IsFeatured(),
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
      images: images.map((image) => ({
        id: image.getId().toString(),
        url: image.getUrl().getValue(),
        isMain: image.getIsMain(),
        name: image.getName(),
        order: image.getOrder(),
      })),
    });
  }
}
