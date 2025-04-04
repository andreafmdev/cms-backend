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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Groups')
@Controller('groups')
export class GroupController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}
  @RequireGroup('ADMIN')
  @Post('create-group')
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({
    status: 201,
    description: 'Group created successfully',
    type: CreateGroupResponseDto,
  })
  async createGroup(
    @Body() createGroupDto: CreateGroupRequestDto,
  ): Promise<CreateGroupResponseDto> {
    const { name, permissions } = createGroupDto;
    const command = new CreateGroupCommand(name, permissions);
    return await this.commandBus.execute(command);
  }

  @RequirePermission('READ')
  @Get('get-groups')
  @ApiOperation({ summary: 'Get all groups' })
  @ApiResponse({
    status: 200,
    description: 'Groups found successfully',
    type: GetGroupsResponseDto,
  })
  async getGroups(): Promise<GetGroupsResponseDto[]> {
    return await this.queryBus.execute(new GetGroupsQuery());
  }
}
