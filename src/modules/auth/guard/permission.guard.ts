import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

import { RequestWithUser } from '../types/requestWithUser';
@Injectable()
export class PermissionGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Prima verifica che il JWT sia valido
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Ottieni i ruoli richiesti dall'handler
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true; // Se non ci sono ruoli richiesti, permetti l'accesso
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = request;

    // Verifica se l'utente ha TUTTI i permessi richiesti
    return hasAllPermissions(user.permissions, requiredPermissions);
  }
}
function hasAllPermissions(
  userPermissions: string[] | undefined,
  requiredPermissions: string[],
): boolean {
  if (!userPermissions?.length) return false;

  const userPermsSet = new Set(userPermissions.map((p) => p.toUpperCase()));
  const hasPermissions = requiredPermissions.every((p) =>
    userPermsSet.has(p.toUpperCase()),
  );
  return hasPermissions;
}
