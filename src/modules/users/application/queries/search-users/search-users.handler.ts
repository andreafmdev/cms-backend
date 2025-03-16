import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchUsersQuery } from '@module/users/application/queries/search-users/search-users.query';
import { SearchUsersResponseDto } from '@module/users/application/queries/search-users/search-users.response.dto';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { UserMapper } from '@module/users/infrastructure/mapper/user-mapper';
import { UserFilterDto } from '../../dto/user-filter.dto';
import { UserService } from '../../services/user.service';
import { PaginatedResponseDto } from '@shared/dto/paginated.response.dto';
import { paginate } from '@shared/helpers/pagination.helper';
@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler implements IQueryHandler<SearchUsersQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
    private readonly userService: UserService,
  ) {}

  async execute(
    query: SearchUsersQuery,
  ): Promise<PaginatedResponseDto<SearchUsersResponseDto>> {
    let usersResults: SearchUsersResponseDto[] = [];
    let filters: Partial<UserFilterDto> = {};

    if (query.filters) {
      filters = query.filters;
    }

    const [users, totalUsers] = await Promise.all([
      this.userService.findUsersByFilters(filters),
      this.userService.countUsersByFilters(filters),
    ]);

    usersResults = users.map((user) =>
      plainToInstance(SearchUsersResponseDto, {
        id: user.getId().toString(),
        username: user.getUsername(),
        email: user.getEmail().toString(),
        details: {
          address: user.getDetails().getAddress(),
          phoneNumber: user.getDetails().getPhoneNumber(),
          profilePictureUrl: user.getDetails().getProfilePictureUrl(),
          biography: user.getDetails().getBiography(),
        },
        groups: user.getGroups().map((group) => ({
          name: group.getName() ?? '',
          permissions: group.getPermissions().map((permission) => ({
            name: permission.getName() ?? '',
          })),
        })),
      }),
    );
    const paginatedUsers = paginate<SearchUsersResponseDto>(
      usersResults,
      totalUsers,
      filters.page!,
      filters.limit!,
    );
    return paginatedUsers;
  }
}
