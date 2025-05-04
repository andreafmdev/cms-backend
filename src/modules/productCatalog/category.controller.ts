import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CategoryFilterDto } from './application/dto/filter/category-filter.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated.response.dto';
import { GetCategoriesResponseDto } from './application/queries/get-categories/get-categories.response';
import { GetCategoriesQuery } from './application/queries/get-categories/get-categories.query';
import { SearchCategoriesTreeRequest } from './application/queries/search-category-tree/search-categories-tree.request';
import { SearchCategoriesTreeQuery } from './application/queries/search-category-tree/search-categories-tree.query';
import { SearchCategoriesTreeResponse } from './application/queries/search-category-tree/search-categories-tree.response';
import { SearchCategoriesRequestDto } from './application/queries/search-categories/search-categories.request';
import { SearchCategoriesQuery } from './application/queries/search-categories/search-categories.query';
import { SearchCategoriesResponseDto } from './application/queries/search-categories/search-categories.response';
import { GetCategoryDetailRequestDto } from './application/queries/get-category-detail/get-category-detail.request';
import { GetCategoryDetailQuery } from './application/queries/get-category-detail/get-category-detail.query';
import { GetCategoryDetailResponseDto } from './application/queries/get-category-detail/get-category-detail.response';
@Controller('categories')
export class CategoryController {
  constructor(private readonly queryBus: QueryBus) {}

  @RequireGroup('ADMIN')
  @Get('test')
  async test(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 'test';
  }

  @Get()
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories found successfully',
    type: PaginatedResponseDto<GetCategoriesResponseDto>,
  })
  @ApiQuery({ type: CategoryFilterDto })
  @ApiBearerAuth()
  async GetAllCategories(
    @Query() request: CategoryFilterDto,
  ): Promise<PaginatedResponseDto<GetCategoriesResponseDto>> {
    return await this.queryBus.execute(new GetCategoriesQuery(request));
  }

  @Post('category-tree')
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get category tree' })
  @ApiResponse({
    status: 200,
    description: 'Category tree found successfully',
  })
  @ApiBearerAuth()
  getCategoryTree(
    @Body() request: SearchCategoriesTreeRequest,
  ): Promise<SearchCategoriesTreeResponse[]> {
    return this.queryBus.execute(
      new SearchCategoriesTreeQuery(request.name, request.languageCode),
    );
  }
  //search category by name
  @Post('search')
  @HttpCode(200)
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Search category by name' })
  @ApiResponse({
    status: 200,
    description: 'Categories found successfully',
    type: PaginatedResponseDto<SearchCategoriesResponseDto>,
  })
  @ApiQuery({ type: SearchCategoriesRequestDto })
  @ApiBearerAuth()
  searchCategoryByName(
    @Body() request: SearchCategoriesRequestDto,
  ): Promise<PaginatedResponseDto<SearchCategoriesResponseDto>> {
    return this.queryBus.execute(new SearchCategoriesQuery(request));
  }
  //detail category
  @Get('detail')
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Category found successfully',
  })
  @ApiBearerAuth()
  getCategoryDetail(
    @Query() request: GetCategoryDetailRequestDto,
  ): Promise<GetCategoryDetailResponseDto> {
    return this.queryBus.execute(
      new GetCategoryDetailQuery(request.id, request.languageCode),
    );
  }
}
