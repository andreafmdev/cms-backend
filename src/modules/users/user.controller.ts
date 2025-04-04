import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Query,
  HttpCode,
  Param,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { SearchUsersQuery } from '@module/users/application/queries/search-users/search-users.query';
import { SearchUsersResponseDto } from './application/queries/search-users/search-users.response.dto';

import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import { RequestWithUser } from '@module/auth/types/requestWithUser';
import { UserFilterDto } from './application/dto/user-filter.dto';
import { HttpStatus } from '@nestjs/common';
import { PaginatedResponseDto } from '../../shared/dto/paginated.response.dto';
import { GetUsersQuery } from './application/queries/get-users/get-users.query';
import { GetUsersResponseDto } from './application/queries/get-users/get-users.response';
import { GetUserDetailQuery } from './application/queries/get-user-detail/get-user-detail.query';
import { GetUserDetailResponseDto } from './application/queries/get-user-detail/get-user-detail.response.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @RequireGroup('ADMIN', 'EDITOR')
  @HttpCode(HttpStatus.OK)
  @Post('search')
  @ApiOperation({ summary: 'Search users by filters' })
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
    type: PaginatedResponseDto<SearchUsersResponseDto>,
  })
  @ApiBody({ type: UserFilterDto })
  @ApiBearerAuth()
  async findAllByFilters(
    @Body() filters: UserFilterDto,
  ): Promise<PaginatedResponseDto<SearchUsersResponseDto>> {
    return await this.queryBus.execute(new SearchUsersQuery(filters));
  }

  @Get('test-groups')
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Test groups' })
  @ApiBearerAuth()
  testGroups(@Req() request: RequestWithUser) {
    const user = request.user;
    return {
      message: 'Access granted',
      user: user,
      groups: user.groups,
    };
  }

  @Get('detail/:id')
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get user detail' })
  @ApiResponse({
    status: 200,
    description: 'User detail found successfully',
    type: GetUserDetailResponseDto,
  })
  @ApiBearerAuth()
  async GetUserDetail(
    @Param('id') id: string,
  ): Promise<GetUserDetailResponseDto> {
    return await this.queryBus.execute(new GetUserDetailQuery(id));
  }

  @Get()
  @RequireGroup('ADMIN')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
    type: PaginatedResponseDto<GetUsersResponseDto>,
  })
  @ApiQuery({ type: UserFilterDto })
  @ApiBearerAuth()
  async GetAllUsers(
    @Query() request: UserFilterDto,
  ): Promise<PaginatedResponseDto<GetUsersResponseDto>> {
    return await this.queryBus.execute(new GetUsersQuery(request));
  }
}
