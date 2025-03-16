// users Module// src/features/users/users.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { DatabaseModule } from '@base/infrastructure/database/database.module';
import { UsersController } from './user.controller';
import { UserDetailOrmEntity } from '@userModule/infrastructure/entities/user-detail.orm-entity';
import { SearchUsersHandler } from '@module/users/application/queries/search-users/search-users.handler';
import { UserMapper } from '@module/users/infrastructure/mapper/user-mapper';
import { SignUpHandler } from './application/commands/sign-up/sign-up.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GroupRepository } from './infrastructure/repositories/group.repository';
import { UserEventsModule } from './application/events/user-events.module';
import { UserDetailMapper } from './infrastructure/mapper/user-detail.mapper';
import { GroupMapper } from './infrastructure/mapper/group.mapper';
import { PermissionMapper } from './infrastructure/mapper/permission.mapper';
import { CreateGroupHandler } from './application/commands/create-group/create-group.handler';
import { GroupService } from './application/services/group.service';
import { PermissionRepository } from './infrastructure/repositories/permission.repository';
import { GetGroupsHandler } from './application/queries/get-groups/get-groups.handler';
import { UserService } from './application/services/user.service';
import { GroupController } from './group.controller';
import { MailerModule } from '@module/mailer/mailer.module';
import { AuthModule } from '@module/auth/auth.module';
import { GetUsersHandler } from './application/queries/get-users/get-users.handler';
const Entities = [
  UserOrmEntity,
  GroupOrmEntity,
  PermissionOrmEntity,
  UserDetailOrmEntity,
];
const CommandHandlers = [SignUpHandler, CreateGroupHandler];
const QueryHandlers = [SearchUsersHandler, GetGroupsHandler, GetUsersHandler];
const Services = [GroupService, UserService];
const Repositories = [GroupRepository, UserRepository, PermissionRepository];
const Mappers = [GroupMapper, PermissionMapper, UserMapper, UserDetailMapper];
const Controllers = [UsersController, GroupController];
@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([...Entities]),
    UserEventsModule,
    MailerModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [...Controllers],
  providers: [
    ...Mappers,
    ...Services,
    ...Repositories,
    ...QueryHandlers,
    ...CommandHandlers,
  ],
  exports: [UserService],
})
export class UserModule {
  constructor() {}
}
