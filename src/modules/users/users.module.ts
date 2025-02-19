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
import { CqrsModule } from '@nestjs/cqrs';
import { GetUsersHandler } from '@userModule/application/handlers/get-users.handler';
import { UserMapper } from '@userModule/application/mapper/user-mapper';
@Module({
  imports: [
    CqrsModule,
    DatabaseModule, // ✅ Usa il modulo centrale

    TypeOrmModule.forFeature([
      UserOrmEntity,
      GroupOrmEntity,
      PermissionOrmEntity,
      UserDetailOrmEntity,
    ]),
  ],

  controllers: [UsersController],
  providers: [UserRepository, GetUsersHandler, UserMapper], // ✅ Registra il repository
  exports: [], // ✅ Esporta il repository per altri moduli
})
export class UsersModule {}
