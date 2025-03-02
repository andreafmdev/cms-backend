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

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //?validateUser method (VALIDATE USER)
  async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User | null> {
    const user: User | null = await this.userService.findOneByEmail(email);
    const isPasswordValid = user?.verifyPassword(plainPassword);
    if (user && isPasswordValid) {
      return user;
    }
    return null;
  }
  //?signIn method (LOGIN)

  async signIn(email: string) {
    const user: User | null = await this.userService.findOneByEmail(email);
    if (user) {
      const permissionsArray = user
        .getGroups()
        .flatMap((group) =>
          group.getPermissions().map((permission) => permission.getName()),
        );
      const uniquePermissions = [...new Set(permissionsArray)];

      const payload = {
        email: user.getEmail().getValue(),
        sub: user.getId().toString(),
        username: user.getUsername(),
        groups: user.getGroups().map((g) => g.getName()),
        permissions: uniquePermissions,
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.getId().toString(),
          email: user.getEmail().getValue(),
          username: user.getUsername(),
          groups: user.getGroups().map((g) => g.getName()),
          permissions: uniquePermissions,
        },
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  //?signUp method (REGISTER)
  async signUp(username: string, email: string, password: string) {
    const user: User | null = await this.userService.createUser(
      username,
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Sign Up failed');
    }
    return this.signIn(email);
  }

  async login(email: string, plainPassword: string) {
    const user = await this.validateUser(email, plainPassword);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signIn(email);
  }
  async validateToken(token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token', error as HttpException);
    }
  }
}
