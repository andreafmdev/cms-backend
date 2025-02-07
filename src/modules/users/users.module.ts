// users Module// src/features/users/users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '@userModule/infrastructure/entities/user.orm-entity';
import { GroupOrmEntity } from '@userModule/infrastructure/entities/group.orm-entity';
import { PermissionOrmEntity } from '@userModule/infrastructure/entities/permission.orm-entity';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule, // ✅ Usa il modulo centrale
    TypeOrmModule.forFeature([
      UserOrmEntity,
      GroupOrmEntity,
      PermissionOrmEntity,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class UsersModule {}
