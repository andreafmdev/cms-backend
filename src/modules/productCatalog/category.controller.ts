import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Roles } from 'nest-keycloak-connect';

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
import { SearchCategoryOptionsRequest } from './application/queries/search-category-tree/search-category-options.request';
import { SearchCategoryOptionsQuery } from './application/queries/search-category-tree/search-category-options.query';
import { SearchCategoryOptionsResponse } from './application/queries/search-category-tree/search-category-options.response';
import { SearchCategoriesRequestDto } from './application/queries/search-categories/search-categories.request';
import { SearchCategoriesQuery } from './application/queries/search-categories/search-categories.query';
import { SearchCategoriesResponseDto } from './application/queries/search-categories/search-categories.response';
import { GetCategoryDetailRequestDto } from './application/queries/get-category-detail/get-category-detail.request';
import { GetCategoryDetailQuery } from './application/queries/get-category-detail/get-category-detail.query';
import { GetCategoryDetailResponseDto } from './application/queries/get-category-detail/get-category-detail.response';
import { CreateCategoryRequestDto } from './application/commands/create-category/create-category.request';
import { CreateCategoryResponseDto } from './application/commands/create-category/create-category.response';
import { CreateCategoryCommand } from './application/commands/create-category/create-category.command';
import { DeleteCategoryResponse } from './application/commands/delete-category/delete-category.response';
import { DeleteCategoryCommand } from './application/commands/delete-category/delete-category.command';
import { UpdateCategoryCommand } from './application/commands/update-category/update-category.command';
import { UpdateCategoryRequestDto } from './application/commands/update-category/update-category.request';
import { UpdateCategoryResponseDto } from './application/commands/update-category/update-category.response';
import { GetCategoryAttributeResponse } from './application/queries/get-category-attributes/get-category-attribute.response';
import { GetCategoryAttributesQuery } from './application/queries/get-category-attributes/get-category-attributes.query';
import { GetCategoryAttributesRequestDto } from './application/queries/get-category-attributes/get-category-attribute.request';
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  //test
  @Roles('tm-read')
  @Get('test')
  async test(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 'test';
  }
  //get all categories
  @Get()
  @Roles('tm-read')
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
  //search category options
  @Post('options')
  @Roles('tm-read')
  @ApiOperation({ summary: 'Search category options' })
  @ApiResponse({
    status: 200,
    description: 'Category options found successfully',
  })
  @ApiQuery({ type: SearchCategoryOptionsRequest })
  searchCategoryOptions(
    @Body() request: SearchCategoryOptionsRequest,
  ): Promise<SearchCategoryOptionsResponse[]> {
    return this.queryBus.execute(
      new SearchCategoryOptionsQuery(request.name, request.languageCode),
    );
  }
  //search category by params
  @Post('search')
  @HttpCode(200)
  @Roles('tm-read')
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
  @Get(':id')
  @Roles('tm-read')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({
    status: 200,
    description: 'Category found successfully',
  })
  @ApiBearerAuth()
  getCategoryDetail(
    @Param('id') id: string,
    @Query() request: GetCategoryDetailRequestDto,
  ): Promise<GetCategoryDetailResponseDto> {
    return this.queryBus.execute(
      new GetCategoryDetailQuery(
        id,
        request.languageCode,
        request.includeAllTranslations,
      ),
    );
  }
  //create category
  @Post()
  @Roles('tm-read', 'tm-write')
  @ApiOperation({ summary: 'Create category' })
  @ApiBearerAuth()
  createCategory(
    @Body() request: CreateCategoryRequestDto,
  ): Promise<CreateCategoryResponseDto> {
    return this.commandBus.execute(
      new CreateCategoryCommand(request.translations, request.attributes),
    );
  }
  //update category
  @Patch(':id')
  @Roles('tm-read', 'tm-write')
  @ApiOperation({ summary: 'Update category' })
  @ApiBearerAuth()
  updateCategory(
    @Param('id') id: string,
    @Body() request: UpdateCategoryRequestDto,
  ): Promise<UpdateCategoryResponseDto> {
    return this.commandBus.execute(
      new UpdateCategoryCommand(request.translations, request.attributes, id),
    );
  }
  //delete category
  @Delete(':id')
  @Roles('tm-read', 'tm-write', 'tm-delete')
  @ApiOperation({ summary: 'Delete category' })
  @ApiBearerAuth()
  deleteCategory(@Param('id') id: string): Promise<DeleteCategoryResponse> {
    return this.commandBus.execute(new DeleteCategoryCommand(id));
  }
  //get category attributes
  @Get(':id/attributes')
  @Roles('tm-read')
  @ApiOperation({ summary: 'Get category attributes' })
  @ApiBearerAuth()
  @ApiQuery({ type: GetCategoryAttributesRequestDto })
  getCategoryAttributes(
    @Param('id') id: string,
    @Query() request: GetCategoryAttributesRequestDto,
  ): Promise<GetCategoryAttributeResponse[]> {
    return this.queryBus.execute(
      new GetCategoryAttributesQuery(id, request.languageCode),
    );
  }
}
