import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CreateGroupCommand } from './create-group.command';
import { GroupMapper } from '@module/users/infrastructure/mapper/group.mapper';
import { GroupService } from '@module/users/application/services/group.service';
import { GroupRepository } from '@module/users/infrastructure/repositories/group.repository';

@CommandHandler(CreateGroupCommand)
export class CreateGroupHandler implements ICommandHandler<CreateGroupCommand> {
  constructor(
    private readonly groupMapper: GroupMapper,
    private readonly groupService: GroupService,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(command: CreateGroupCommand): Promise<void> {
    const { name, permissions } = command;

    await this.groupService.createGroup(name, permissions);
  }
}
