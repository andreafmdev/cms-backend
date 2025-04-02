import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../services/user.service';
import { GetUserDetailResponseDto } from './get-user-detail.response.dto';
import { plainToInstance } from 'class-transformer';
import { GetUserDetailQuery } from './get-user-detail.query';
import { UserId } from '@module/users/domain/value-objects/user-id.vo';
import { User } from '@module/users/domain/aggretates/user';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserDetailQuery)
export class GetUserDetailHandler implements IQueryHandler<GetUserDetailQuery> {
  constructor(private readonly userService: UserService) {}

  async execute(query: GetUserDetailQuery): Promise<GetUserDetailResponseDto> {
    const userId = UserId.create(query.id);
    const user: User | null = await this.userService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userResult = plainToInstance(GetUserDetailResponseDto, {
      id: user.getId().toString() ?? '',
      username: user.getUsername(),
      email: user.getEmail().toString(),
      groups: user.getGroups().map((group) => ({
        name: group.getName(),
        permissions: group.getPermissions().map((permission) => ({
          name: permission.getName(),
        })),
      })),
      details: user.getDetails(),
    });

    return userResult;
  }
}
