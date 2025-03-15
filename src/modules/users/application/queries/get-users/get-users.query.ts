// get-users.query.ts
import { UserFilterDto } from '@module/users/application/dto/user-filter.dto';
export class GetUsersQuery {
  constructor(public readonly filters?: UserFilterDto) {}
}
