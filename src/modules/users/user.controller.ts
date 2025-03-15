import { Controller, Get, Post, Req, Body, HttpCode } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '@module/users/application/queries/get-users/get-users.query';
import { GetUsersQueryResult } from './application/queries/get-users/get-users.response.dto';

import { RequireGroup } from '@module/auth/decorator/auth.decorator';
import { RequestWithUser } from '@module/auth/types/requestWithUser';
import { UserFilterDto } from './application/dto/user-filter.dto';
import { HttpStatus } from '@nestjs/common';
@Controller('users')
export class UsersController {
  constructor(private readonly queryBus: QueryBus) {}

  @RequireGroup('ADMIN', 'EDITOR')
  @HttpCode(HttpStatus.OK)
  @Post()
  async findAllByFilters(
    @Body() filters: UserFilterDto,
  ): Promise<GetUsersQueryResult[]> {
    return await this.queryBus.execute(new GetUsersQuery(filters));
  }

  @Get('test-groups')
  @RequireGroup('Admin')
  testGroups(@Req() request: RequestWithUser) {
    const user = request.user;
    return {
      message: 'Access granted',
      user: user,
      groups: user.groups,
    };
  }
}
