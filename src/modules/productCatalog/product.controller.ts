import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Body, Get, Post, Query } from '@nestjs/common';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { ProductFilterDto } from './application/dto/filter/product-filter.dto';
import { GetProductsResponseDto } from './application/queries/get-products/get-products.response';
import { GetProductsQuery } from './application/queries/get-products/get-products.query';
import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { CreateProductCommand } from './application/commands/create-product/create-product.command';
import { CreateProductRequestDto } from './application/commands/create-product/create-product.request';
import { CreateProductResponseDto } from './application/commands/create-product/create-product.response';
import { GetProductCatalogQuery } from './application/queries/get-product-catalog/get-product-catalog.query';
import { GetProductCatalogResponseDto } from './application/queries/get-product-catalog/get-product-catalog.response';
import { ProductCatalogFilterDto } from './application/dto/filter/product-catalog-filter.dto';
import { SearchProductsResponseDto } from './application/queries/search-products/search-products.response';
import { SearchProductsQuery } from './application/queries/search-products/search-products.query';
import { SearchProductsRequestDto } from './application/queries/search-products/search-products.request';
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
  @RequireGroup('ADMIN')
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
  @RequireGroup('ADMIN')
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
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  async createProduct(
    @Body() request: CreateProductRequestDto,
  ): Promise<CreateProductResponseDto> {
    const command = new CreateProductCommand(
      request.price,
      request.brandId,
      request.categoryId,
      request.isActive,
      request.translations,
      [],
    );
    return await this.commandBus.execute(command);
  }
  //get product catalog
  @Get('catalog')
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get product catalog' })
  @ApiBearerAuth()
  async getProductCatalog(
    @Query() request: ProductCatalogFilterDto,
  ): Promise<PaginatedResponseDto<GetProductCatalogResponseDto>> {
    const query = new GetProductCatalogQuery(request);

    return await this.queryBus.execute(query);
  }
}
