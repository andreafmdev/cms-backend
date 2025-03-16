// get-users.query.ts
import { UserFilterDto } from '@module/users/application/dto/user-filter.dto';
export class SearchUsersQuery {
  constructor(public readonly filters?: UserFilterDto) {}
}
