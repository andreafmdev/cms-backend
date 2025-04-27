import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Get, Query } from '@nestjs/common';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { ProductFilterDto } from './application/dto/product-filter.dto';
import { GetProductsResponseDto } from './application/queries/get-products/get-products.response';
import { GetProductsQuery } from './application/queries/get-products/get-products.query';

export class ProductController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get all products' })
  @ApiBearerAuth()
  async getAllProducts(
    @Query() request: ProductFilterDto,
  ): Promise<PaginatedResponseDto<GetProductsResponseDto>> {
    return await this.queryBus.execute(new GetProductsQuery(request));
  }
}
