import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CategoryFilterDto } from './application/dto/category-filter.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated.response.dto';
import { GetCategoriesResponseDto } from './application/queries/get-categories/get-categories.response';
import { GetCategoriesQuery } from './application/queries/get-categories/get-categories.query';

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
}
