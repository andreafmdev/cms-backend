import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from '../types/requestWithUser';
import { Reflector } from '@nestjs/core';
@Injectable()
export class GroupGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //allow to read metadata from decordators applied to the controller or the handler
    const jwtValid = await super.canActivate(context);
    if (!jwtValid) {
      return false;
    }

    const requiredGroups = this.reflector.get<string[]>(
      'groups',
      context.getHandler(),
    );
    this.getGuardLogger().debug(
      `Required groups: ${JSON.stringify(requiredGroups)}`,
    );

    if (!requiredGroups?.length) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (!request.user.groups || !Array.isArray(request.user.groups)) {
      this.getGuardLogger().error('User groups not found or not an array');
      return false;
    }
    const { user } = request;
    return requiredGroups.some((group) =>
      user.groups?.includes(group.toUpperCase()),
    );
  }
}
