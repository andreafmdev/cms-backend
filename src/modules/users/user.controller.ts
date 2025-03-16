import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Query,
  HttpCode,
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
@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @RequireGroup('ADMIN', 'EDITOR')
  @HttpCode(HttpStatus.OK)
  @Post('search')
  async findAllByFilters(
    @Body() filters: UserFilterDto,
  ): Promise<PaginatedResponseDto<SearchUsersResponseDto>> {
    return await this.queryBus.execute(new SearchUsersQuery(filters));
  }

  @Get('test-groups')
  @RequireGroup('ADMIN')
  testGroups(@Req() request: RequestWithUser) {
    const user = request.user;
    return {
      message: 'Access granted',
      user: user,
      groups: user.groups,
    };
  }

  @Get()
  @RequireGroup('ADMIN')
  async GetAllUsers(
    @Query() request: UserFilterDto,
  ): Promise<PaginatedResponseDto<GetUsersResponseDto>> {
    return await this.queryBus.execute(new GetUsersQuery(request));
  }
}
