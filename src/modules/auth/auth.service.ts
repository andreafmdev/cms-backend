import {
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@module/users/application/services/user.service';
import { User } from '@module/users/domain/aggretates/user';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwtPayload.type';
import { UserId } from '@module/users/domain/value-objects/user-id.vo';
import { ConfigService } from '@nestjs/config';
export interface AuthToken {
  access_token: string;
  refresh_token: string;
  user?: {
    id: string;
    email: string;
    username: string;
    groups: string[];
    permissions: string[];
  };
}
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //?validateUser method (VALIDATE)
  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user: User | null = await this.userService.findOneByEmail(email);
      if (!user) {
        return null;
      }
      const isPasswordValid = user?.verifyPassword(password);
      if (!isPasswordValid) {
        return null;
      }
      return user;
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid credentials',
        e as HttpException,
      );
    }
  }

  //?signUp method (REGISTER)
  async signUp(
    username: string,
    email: string,
    password: string,
  ): Promise<AuthToken> {
    const user: User | null = await this.userService.createUser(
      username,
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Sign Up failed');
    }
    return this.login(email, password);
  }

  async refreshToken(oldRefreshToken: string): Promise<AuthToken> {
    try {
      //?verify refresh token
      const decoded: JwtPayload = this.jwtService.verify(oldRefreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET', 'REFRESH_SECRET'),
      });

      //?get user id
      const userId = UserId.create(decoded.sub);
      //?get user
      const user: User | null = await this.userService.findOneById(userId);

      //?check if user exists
      if (!user) {
        throw new UnauthorizedException('Unable to refresh token');
      }
      //?generate new auth tokens
      const authToken = this.generateAuthResponse(user);

      //?return auth token
      return authToken;
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid refresh token',
        e as HttpException,
      );
    }
  }
  async generateTokensForUser(userId: string): Promise<AuthToken> {
    const user = await this.userService.findOneById(UserId.create(userId));
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateAuthResponse(user);
  }
  //?login method (LOGIN)

  private async login(
    email: string,
    plainPassword: string,
  ): Promise<AuthToken> {
    try {
      const user: User | null = await this.validateUser(email, plainPassword);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const token: AuthToken = this.generateAuthResponse(user);
      return token;
    } catch (e) {
      throw new UnauthorizedException(
        'Invalid credentials',
        e as HttpException,
      );
    }
  }
  //?generateAuthResponse method (GENERATE AUTH RESPONSE)
  private generateAuthResponse(user: User, includeUserData = false): AuthToken {
    //?extract unique permissions
    const permissionsArray = user
      .getGroups()
      .flatMap((group) =>
        group.getPermissions().map((permission) => permission.getName()),
      );
    const uniquePermissions = [...new Set(permissionsArray)];
    //?create payload
    const payload: JwtPayload = {
      email: user.getEmail().getValue(),
      sub: user.getId().toString(),
      username: user.getUsername(),
      groups: user.getGroups().map((g) => g.getName()),
      permissions: uniquePermissions,
    };

    //?generate access token
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN', '60m'),
    });
    //?generate refresh token
    const refreshToken = this.jwtService.sign(
      { sub: user.getId().toString() },
      {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
        secret: this.configService.get('JWT_REFRESH_SECRET', 'REFRESH_SECRET'),
      },
    );

    //?response
    const response: AuthToken = {
      access_token: accessToken,
      refresh_token: refreshToken,
    };

    //?add user data if requested
    if (includeUserData) {
      response.user = {
        id: user.getId().toString(),
        email: user.getEmail().getValue(),
        username: user.getUsername(),
        groups: user.getGroups().map((g) => g.getName()),
        permissions: uniquePermissions,
      };
    }

    return response;
  }
}
