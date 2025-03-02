import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateGroupCommand } from './application/commands/create-group/create-group.command';
import { CreateGroupResponseDto } from './application/commands/create-group/create-group.response';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetGroupsQuery } from './application/queries/get-groups/get-groups.query';
import { GetGroupsResponseDto } from './application/queries/get-groups/get-groups.response';
import {
  RequireGroup,
  RequirePermission,
} from '@module/auth/decorator/auth.decorator';
import { CreateGroupRequestDto } from './application/commands/create-group/create-group.request';

@Controller('groups')
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @RequireGroup('ADMIN')
  @Post('create-group')
  async createGroup(
    @Body() createGroupDto: CreateGroupRequestDto,
  ): Promise<CreateGroupResponseDto> {
    const { name, permissions } = createGroupDto;
    const command = new CreateGroupCommand(name, permissions);
    return await this.commandBus.execute(command);
  }
  @RequirePermission('READ')
  @Get('get-groups')
  async getGroups(): Promise<GetGroupsResponseDto[]> {
    return await this.queryBus.execute(new GetGroupsQuery());
  }
}
