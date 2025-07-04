//import { Roles } from 'nest-keycloak-connect';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  Body,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { ProductFilterDto } from './application/dto/filter/product-filter.dto';
import { GetProductsResponseDto } from './application/queries/get-products/get-products.response';
import { GetProductsQuery } from './application/queries/get-products/get-products.query';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { CreateProductCommand } from './application/commands/create-product/create-product.command';
import { CreateProductResponseDto } from './application/commands/create-product/create-product.response';
import { GetProductCatalogQuery } from './application/queries/get-product-catalog/get-product-catalog.query';
import { GetProductCatalogResponseDto } from './application/queries/get-product-catalog/get-product-catalog.response';
import { ProductCatalogFilterDto } from './application/dto/filter/product-catalog-filter.dto';
import { SearchProductsResponseDto } from './application/queries/search-products/search-products.response';
import { SearchProductsQuery } from './application/queries/search-products/search-products.query';
import { SearchProductsRequestDto } from './application/queries/search-products/search-products.request';
import { GetProductDetailQuery } from './application/queries/get-product-detail/get-product-detail.query';
import { GetProductDetailResponseDto } from './application/queries/get-product-detail/get-product-detail.response';
import { GetProductDetailRequestDto } from './application/queries/get-product-detail/get-product-detail.request';
import {
  FileFieldsInterceptor,
  MemoryStorageFile,
  UploadedFiles,
} from '@x6tech/nest-file-fastify';
import { ProductTranslationDto } from './application/dto/product-translation.dto';
import { ProductAttributeValueDto } from './application/dto/product-attribute-value.dto';
import { ProductFormRequest } from './application/dto/request/product/product-form.request';
import { UpdateProductResponseDto } from './application/commands/update-product/update-product.response';
import { UpdateProductCommand } from './application/commands/update-product/update-product.command';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  /**
   * Search products
   * @param request - The request body containing the product details
   * @returns The created product
   */
  @Post('search')
  @HttpCode(200)
  //@Roles('tm-read')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products found successfully',
    type: PaginatedResponseDto<GetProductsResponseDto>,
  })
  @ApiBody({ type: SearchProductsRequestDto })
  @ApiBearerAuth()
  async searchProducts(
    @Body() request: SearchProductsRequestDto,
  ): Promise<PaginatedResponseDto<SearchProductsResponseDto>> {
    const query = new SearchProductsQuery(request);
    return await this.queryBus.execute(query);
  }
  /**
   * Get all products
   * @param request - The request body containing the product details
   * @returns The created product
   */
  @Get()
  //@Roles('tm-read')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Products found successfully',
    type: PaginatedResponseDto<GetProductsResponseDto>,
  })
  @ApiQuery({ type: ProductFilterDto })
  @ApiBearerAuth()
  async getAllProducts(
    @Query() request: ProductFilterDto,
  ): Promise<PaginatedResponseDto<GetProductsResponseDto>> {
    const query = new GetProductsQuery(request);
    return await this.queryBus.execute(query);
  }
  /**
   * Create a new product
   * @param request - The request body containing the product details
   * @returns The created product
   */
  @Post()
  //@Roles('tm-read', 'tm-write')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 5 }, // o il numero che vuoi
    ]),
  )
  async createProduct(
    @Body() request: ProductFormRequest,
    @UploadedFiles() files: { images?: MemoryStorageFile[] },
  ): Promise<CreateProductResponseDto> {
    const command = new CreateProductCommand(
      parseFloat(request.price),
      request.brandId,
      request.categoryId,
      request.isAvailable === 'true',
      request.isFeatured === 'true',
      JSON.parse(request.translations) as ProductTranslationDto[],
      files.images ?? [],
      request.attributes && request.attributes.length > 0
        ? (JSON.parse(request.attributes) as ProductAttributeValueDto[])
        : [],
    );
    return await this.commandBus.execute(command);
  }
  //get product catalog
  @Get('catalog')
  //@Roles('tm-read')
  @ApiOperation({ summary: 'Get product catalog' })
  async getProductCatalog(
    @Query() request: ProductCatalogFilterDto,
  ): Promise<PaginatedResponseDto<GetProductCatalogResponseDto>> {
    const query = new GetProductCatalogQuery(request);

    return await this.queryBus.execute(query);
  }
  //get product detail
  @Get('detail/:id')
  //@Roles('tm-read')
  @ApiOperation({ summary: 'Get product detail' })
  @ApiBearerAuth()
  async getProductDetail(
    @Param('id') id: string,
    @Query() request: GetProductDetailRequestDto,
  ): Promise<GetProductDetailResponseDto> {
    const query = new GetProductDetailQuery(id, request.languageCode);
    return await this.queryBus.execute(query);
  }
  //update product
  @Patch(':id')
  //@Roles('tm-read', 'tm-write')
  @ApiOperation({ summary: 'Update product' })
  @ApiBearerAuth()
  async updateProduct(
    @Param('id') id: string,
    @Body() request: ProductFormRequest,
    @UploadedFiles() files: { images?: MemoryStorageFile[] },
  ): Promise<UpdateProductResponseDto> {
    const translations = JSON.parse(
      request.translations,
    ) as ProductTranslationDto[];
    const attributes = JSON.parse(
      request.attributes,
    ) as ProductAttributeValueDto[];
    const images =
      files.images?.map((image) => ({
        idImage: image.originalFilename,
        isMain: false,
        content: image,
      })) ?? [];
    const command = new UpdateProductCommand(
      id,
      parseFloat(request.price),
      request.brandId,
      request.categoryId,
      request.isAvailable === 'true',
      request.isFeatured === 'true',
      translations,
      images,
      attributes,
    );
    return await this.commandBus.execute(command);
  }
}
