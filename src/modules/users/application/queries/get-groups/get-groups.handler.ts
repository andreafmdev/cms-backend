import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Group } from '@module/users/domain/aggretates/group';
import { GroupService } from '../../services/group.service';
import { GetGroupsQuery } from './get-groups.query';
import { GetGroupsResponseDto } from './get-groups.response';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetGroupsQuery)
export class GetGroupsHandler implements IQueryHandler<GetGroupsQuery> {
  constructor(private readonly groupService: GroupService) {}

  async execute(): Promise<GetGroupsResponseDto[]> {
    const groups: Group[] = await this.groupService.findAllGroups();

    const groupsResult: GetGroupsResponseDto[] = groups.map((group) =>
      plainToInstance(
        GetGroupsResponseDto,
        {
          id: group.getId().toString() ?? '',
          name: group.getName() ?? '',
          permissions: group.getPermissions().map((p) => ({
            name: p.getName() ?? '',
          })),
        },
        {
          excludeExtraneousValues: true,
        },
      ),
    );
    return groupsResult;
  }
}
