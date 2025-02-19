import { Controller, Get, Param } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetUsersQuery } from '@userModule/application/queries/get-users.query';
import { GetUsersQueryResult } from './application/dtos/get-users.dto';
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  @Get()
  async findAll(): Promise<GetUsersQueryResult[]> {
    return await this.queryBus.execute(new GetUsersQuery());
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<GetUsersQueryResult> {
    return await this.queryBus.execute(new GetUsersQuery(id));
  }
}
