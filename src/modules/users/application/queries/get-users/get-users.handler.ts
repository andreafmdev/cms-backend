import { GetUsersQuery } from '@module/users/application/queries/get-users/get-users.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../services/user.service';
import { GetUsersResponseDto } from './get-users.response';
import { plainToInstance } from 'class-transformer';
import { paginate } from '@shared/helpers/pagination.helper';
import { UserFilterDto } from '../../dto/user-filter.dto';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(
    query: GetUsersQuery,
  ): Promise<PaginatedResponseDto<GetUsersResponseDto>> {
    let usersResults: GetUsersResponseDto[] = [];
    let filters: Partial<UserFilterDto> = {};
    if (query.filters) {
      filters = query.filters;
    }
    const [users, totalUsers] = await Promise.all([
      this.userService.findUsersByFilters(filters),
      this.userService.countUsersByFilters(filters),
    ]);
    usersResults = users.map((user) =>
      plainToInstance(GetUsersResponseDto, {
        id: user.getId().toString() ?? '',
        username: user.getUsername(),
        email: user.getEmail().toString(),
        groups: user.getGroups().map((group) => ({
          name: group.getName(),
          permissions: group.getPermissions().map((permission) => ({
            name: permission.getName(),
          })),
        })),
      }),
    );
    const paginatedUsers: PaginatedResponseDto<GetUsersResponseDto> =
      paginate<GetUsersResponseDto>(
        usersResults,
        totalUsers,
        filters.page!,
        filters.limit!,
      );
    return paginatedUsers;
  }
}
