// users Module// src/features/users/users.module.ts
import { Module, OnModuleInit } from '@nestjs/common';
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
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';

const CommandHandlers = [SignUpHandler];
const QueryHandlers = [GetUsersHandler];

@Module({
  imports: [
    CqrsModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserOrmEntity,
      GroupOrmEntity,
      PermissionOrmEntity,
      UserDetailOrmEntity,
    ]),
  ],

  controllers: [UsersController],
  providers: [SignUpHandler, UserRepository, UserMapper, ...QueryHandlers],
  exports: [],
})
export class UsersModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly commandBus: CommandBus,
  ) {}
  onModuleInit() {
    console.log('✅ Checking registered command handlers in CommandBus...');

    // Recupera gli handler registrati nel CommandBus

    console.log('🔍 Registered Command Handlers:', this.commandBus);
  }
}
