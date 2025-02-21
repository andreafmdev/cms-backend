// users Module// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { DatabaseModule } from '@base/infrastructure/database/database.module';
import { UsersController } from './user.controller';
import { UserDetailOrmEntity } from '@userModule/infrastructure/entities/user-detail.orm-entity';
import { GetUsersHandler } from '@module/users/application/queries/handlers/get-users.handler';
import { UserMapper } from '@userModule/application/mapper/user-mapper';
import { SignUpHandler } from './application/commands/handlers/sign-up.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { GroupRepository } from './infrastructure/repositories/group.repository';
import { SignUpUserEventHandler } from './application/events/sign-up-user.handler';

const CommandHandlers = [SignUpHandler];
const QueryHandlers = [GetUsersHandler];
const EventHandlers = [SignUpUserEventHandler];
@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserOrmEntity,
      GroupOrmEntity,
      PermissionOrmEntity,
      UserDetailOrmEntity,
    ]),
  ],

  controllers: [UsersController],
  providers: [
    UserRepository,
    GroupRepository,
    UserMapper,
    ...QueryHandlers,
    ...CommandHandlers,
    ...EventHandlers,
  ],
  exports: [],
})
export class UsersModule {
  constructor() {}
}
