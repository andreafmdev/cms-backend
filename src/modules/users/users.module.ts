// users Module// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';
import { UserRepository } from '@userModule/infrastructure/repositories/user.repository';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { UsersController } from './user.controller';
import { UserService } from './application/user.service';
import { UserDetailOrmEntity } from './infrastructure/entities/user-detail.orm-entity';
@Module({
  imports: [
    DatabaseModule, // ✅ Usa il modulo centrale
    TypeOrmModule.forFeature([
      UserOrmEntity,
      GroupOrmEntity,
      PermissionOrmEntity,
      UserDetailOrmEntity,
    ]),
  ],

  controllers: [UsersController],
  providers: [UserRepository, UserService], // ✅ Registra il repository
  exports: [UserRepository], // ✅ Esporta il repository per altri moduli
})
export class UsersModule {}
