import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { IStrategyOptions } from 'passport-local';
import { LocalAuthResponseDto } from './dto/local-auth.response';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      usernameField: 'email',
    } as IStrategyOptions);
  }

  async validate(
    email: string,
    password: string,
  ): Promise<LocalAuthResponseDto> {
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.getId().toString(),
      email: user.getEmail().getValue().toString(),
      username: user.getUsername(),
    };
  }
}
