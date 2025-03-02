import { Controller, Get, Param, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '@module/users/application/queries/get-users/get-users.query';
import { GetUsersQueryResult } from './application/queries/get-users/get-users.response.dto';

import {
  RequireGroup,
  RequirePermission,
} from '@module/auth/decorator/auth.decorator';
import { RequestWithUser } from '@module/auth/types/requestWithUser';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  /*@Post('sign-up')
  async create(@Body() signUpRequest: SignUpRequest): Promise<void> {
    const { username, email, password } = signUpRequest;
    const command = new SignUpCommand(username, email, password);
    await this.commandBus.execute(command);
  }*/
  @RequireGroup('ADMIN', 'EDITOR')
  @Get()
  async findAll(): Promise<GetUsersQueryResult[]> {
    return await this.queryBus.execute(new GetUsersQuery());
  }
  @RequirePermission('ASSS', 'WRITE')
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUsersQueryResult> {
    return await this.queryBus.execute(new GetUsersQuery(id));
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
}
