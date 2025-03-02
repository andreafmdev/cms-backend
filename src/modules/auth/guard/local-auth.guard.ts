import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthResponseDto } from '../dto/local-auth.response';
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, authResponse: LocalAuthResponseDto): any {
    if (err || !authResponse) {
      throw err || new UnauthorizedException();
    }

    return authResponse;
  }
}
