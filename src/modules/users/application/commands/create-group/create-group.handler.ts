import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateGroupCommand } from './create-group.command';
import { GroupService } from '@module/users/application/services/group.service';
import { CreateGroupResponseDto } from './create-group.response';

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
  constructor(private readonly groupService: GroupService) {}

  async execute(command: CreateGroupCommand): Promise<CreateGroupResponseDto> {
    const { name, permissions } = command;

    const group = await this.groupService.createGroup(name, permissions);

    return {
      name: group.getName(),
      permissions: group
        .getPermissions()
        .map((permission) => permission.getName()),
    };
  }
}
