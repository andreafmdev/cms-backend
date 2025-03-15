import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '@module/users/application/queries/get-users/get-users.query';
import { GetUsersQueryResult } from '@module/users/application/queries/get-users/get-users.response.dto';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { plainToInstance } from 'class-transformer';
import { UserMapper } from '@module/users/infrastructure/mapper/user-mapper';
import { UserFilterDto } from '../../dto/user-filter.dto';
import { UserService } from '../../services/user.service';
@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
    private readonly userService: UserService,
  ) {}

  async execute(query: GetUsersQuery): Promise<GetUsersQueryResult[]> {
    let usersResults: GetUsersQueryResult[] = [];
    let filters: Partial<UserFilterDto> = {};
    if (query.filters) {
      filters = query.filters;
    }
    const users = await this.userService.findUsersByFilters(filters);

    usersResults = users.map((user) =>
      plainToInstance(GetUsersQueryResult, {
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
          id: group.getId().toString(),
          name: group.getName() ?? '',
        })),
      }),
    );
    return usersResults;
  }
}
