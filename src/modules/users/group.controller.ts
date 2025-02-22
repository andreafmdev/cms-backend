import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateGroupCommand } from './application/commands/create-group/create-group.command';
import { CreateGroupDto } from './application/commands/create-group/create-group.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetGroupsRequestDto } from './application/queries/get-groups/get-groups.request.dto';
import { GetGroupsQuery } from './application/queries/get-groups/get-groups.query';
import { GetGroupsResponseDto } from './application/queries/get-groups/get-groups.response';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('create-group')
  async createGroup(@Body() createGroupDto: CreateGroupDto): Promise<void> {
    const { name, permissions } = createGroupDto;
    const command = new CreateGroupCommand(name, permissions);
    await this.commandBus.execute(command);
  }
  @Get('get-groups')
  async getGroups(
    @Query() getGroupsDto: GetGroupsRequestDto,
  ): Promise<GetGroupsResponseDto[]> {
    const { id, name } = getGroupsDto;
    const command = new GetGroupsQuery(id, name);
    return await this.queryBus.execute(command);
  }
}
