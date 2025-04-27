import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { BrandFilterDto } from './application/dto/brand-filter.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated.response.dto';
import { GetBrandsResponseDto } from './application/queries/get-brands/get-brands.response';
import { GetBrandsQuery } from './application/queries/get-brands/get-brands.query';
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
  @ApiQuery({ type: BrandFilterDto })
  @ApiBearerAuth()
  async GetAllBrands(
    @Query() request: BrandFilterDto,
  ): Promise<PaginatedResponseDto<GetBrandsResponseDto>> {
    return await this.queryBus.execute(new GetBrandsQuery(request));
  }
}
