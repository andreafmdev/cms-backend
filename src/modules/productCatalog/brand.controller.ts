import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { BrandFilterDto } from './application/dto/filter/brand-filter.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated.response.dto';
import { GetBrandsResponseDto } from './application/queries/get-brands/get-brands.response';
import { GetBrandsQuery } from './application/queries/get-brands/get-brands.query';
import { ApiTags } from '@nestjs/swagger';
import { SearchBrandsQuery } from './application/queries/search-brands/search-brands.query';
import { SearchBrandsResponseDto } from './application/queries/search-brands/search-brands.response';
import { SearchBrandsRequestDto } from './application/queries/search-brands/search-brands.request';
import { GetBrandDetailRequestDto } from './application/queries/get-brand-detail/get-brand-detail.request';
import { GetBrandDetailResponseDto } from './application/queries/get-brand-detail/get-brand-detail.response';
import { GetBrandDetailQuery } from './application/queries/get-brand-detail/get-brand-detail.query';

@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(private readonly queryBus: QueryBus) {}
  @RequireGroup('ADMIN')
  @Get('test')
  async test(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 'test';
  }
  @Get()
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Brands found successfully',
    type: PaginatedResponseDto<GetBrandsResponseDto>,
  })
  @ApiBody({ type: BrandFilterDto })
  @ApiBearerAuth()
  async GetAllBrands(
    @Body() request: BrandFilterDto,
  ): Promise<PaginatedResponseDto<GetBrandsResponseDto>> {
    return await this.queryBus.execute(new GetBrandsQuery(request));
  }
  @Post('search')
  @HttpCode(200)
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Search brands' })
  @ApiResponse({
    status: 200,
    description: 'Brands found successfully',
  })
  @ApiBody({ type: SearchBrandsRequestDto })
  async searchBrands(
    @Body() request: SearchBrandsRequestDto,
  ): Promise<PaginatedResponseDto<SearchBrandsResponseDto>> {
    return await this.queryBus.execute(new SearchBrandsQuery(request));
  }
  //detail brand
  @Get('detail')
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get brand by id' })
  @ApiResponse({
    status: 200,
    description: 'Brand found successfully',
  })
  @ApiBearerAuth()
  async getBrandById(
    @Query() request: GetBrandDetailRequestDto,
  ): Promise<GetBrandDetailResponseDto> {
    const query = new GetBrandDetailQuery(request);
    return await this.queryBus.execute(query);
  }
}
