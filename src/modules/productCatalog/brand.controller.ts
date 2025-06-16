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
import { QueryBus } from '@nestjs/cqrs';
import { Roles } from 'nest-keycloak-connect';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../shared/dto/paginated.response.dto';
import { GetBrandsResponseDto } from './application/queries/get-brands/get-brands.response';
import { GetBrandsQuery } from './application/queries/get-brands/get-brands.query';
import { ApiTags } from '@nestjs/swagger';
import { SearchBrandsQuery } from './application/queries/search-brands/search-brands.query';
import { SearchBrandsResponseDto } from './application/queries/search-brands/search-brands.response';
import { SearchBrandsRequestDto } from './application/queries/search-brands/search-brands.request';
import { GetBrandDetailResponseDto } from './application/queries/get-brand-detail/get-brand-detail.response';
import { GetBrandDetailQuery } from './application/queries/get-brand-detail/get-brand-detail.query';
import { GetBrandsRequestDto } from './application/queries/get-brands/get-brands-request';
import { GetBrandOptionsResponseDto } from './application/queries/get-brand-options/get-brand-options.response';
import { GetBrandOptionsQuery } from './application/queries/get-brand-options/get-brand-options.query';
import { GetBrandOptionsRequestDto } from './application/queries/get-brand-options/get-brand-options.request';
import { UpdateBrandCommand } from './application/commands/update-brand/update-brand.command';
import { UpdateBrandResponseDto } from './application/commands/update-brand/update-brand.response';
import { UpdateBrandRequestDto } from './application/commands/update-brand/update-brand.request';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBrandResponseDto } from './application/commands/create-brand/create-brand.response';
import { CreateBrandCommand } from './application/commands/create-brand/create-brand.command';
import { CreateBrandRequestDto } from './application/commands/create-brand/create-brand.request';
import { DeleteBrandResponse } from './application/commands/delete-brand/delete-brand.response';
import { DeleteBrandCommand } from './application/commands/delete-brand/delete-brand.command';
@ApiTags('Brands')
@Controller('brands')
export class BrandController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @Roles('tm-read')
  @Get('test')
  async test(): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return 'test';
  }
  @Post('get-all')
  @HttpCode(200)
  @Roles('tm-read')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Brands found successfully',
    type: PaginatedResponseDto<GetBrandsResponseDto>,
  })
  @ApiBody({ type: GetBrandsRequestDto })
  @ApiBearerAuth()
  async GetAllBrands(
    @Body() request: GetBrandsRequestDto,
  ): Promise<PaginatedResponseDto<GetBrandsResponseDto>> {
    return await this.queryBus.execute(
      new GetBrandsQuery(request.id, request.name),
    );
  }
  @Post('search')
  @HttpCode(200)
  @Roles('tm-read')
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
  @Get(':id')
  @Roles('tm-read')
  @ApiOperation({ summary: 'Get brand by id' })
  @ApiResponse({
    status: 200,
    description: 'Brand found successfully',
  })
  @ApiBearerAuth()
  async getBrandById(
    @Param('id') id: string,
  ): Promise<GetBrandDetailResponseDto> {
    return this.queryBus.execute(new GetBrandDetailQuery(id));
  }
  //get brand options (select options)
  @Get('options')
  @ApiOperation({ summary: 'Get brand options' })
  @ApiResponse({
    status: 200,
    description: 'Brand options found successfully',
  })
  async getBrandOptions(
    @Query() request: GetBrandOptionsRequestDto,
  ): Promise<GetBrandOptionsResponseDto[]> {
    return await this.queryBus.execute(
      new GetBrandOptionsQuery(request.id, request.name),
    );
  }
  //create brand
  @Post('')
  @Roles('tm-read', 'tm-write')
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBearerAuth()
  async createBrand(
    @Body() request: CreateBrandRequestDto,
  ): Promise<CreateBrandResponseDto> {
    const command = new CreateBrandCommand(request.name);
    return await this.commandBus.execute(command);
  }
  //update brand
  @Patch(':id')
  @Roles('tm-read', 'tm-write')
  @ApiOperation({ summary: 'Update a brand' })
  @ApiBearerAuth()
  async updateBrand(
    @Param('id') id: string,
    @Body() request: UpdateBrandRequestDto,
  ): Promise<UpdateBrandResponseDto> {
    const command = new UpdateBrandCommand(request.name, id);
    return await this.commandBus.execute(command);
  }
  //delete brand
  @Delete(':id')
  @Roles('tm-read', 'tm-write', 'tm-delete')
  @ApiOperation({ summary: 'Delete a brand' })
  @ApiBearerAuth()
  async deleteBrand(@Param('id') id: string): Promise<DeleteBrandResponse> {
    const command = new DeleteBrandCommand(id);
    return await this.commandBus.execute(command);
  }
}
