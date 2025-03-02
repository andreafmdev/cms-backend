import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guard/permission.guard';
import { GroupGuard } from '../guard/group.guard';
import { Reflector } from '@nestjs/core';
export const Roles = Reflector.createDecorator<string[]>();
export const Permissions = Reflector.createDecorator<string[]>();
export const RequirePermission = (...permissions: string[]) =>
  applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(PermissionGuard),
  );

export const RequireGroup = (...groups: string[]) =>
  applyDecorators(SetMetadata('groups', groups), UseGuards(GroupGuard));
