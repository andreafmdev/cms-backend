import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthStrategy } from './local.strategy';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserModule } from '@module/users/user.module';
import { GroupGuard } from './guard/group.guard';
import { PermissionGuard } from './guard/permission.guard';
import { JwtAuthStrategy } from './jwt.strategy';
const imports = [
  PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
    }),
    inject: [ConfigService],
  }),
  forwardRef(() => UserModule),
];
@Module({
  imports: [...imports],
  controllers: [AuthController],
  providers: [
    /*guard*/
    LocalAuthGuard,
    PermissionGuard,
    JwtAuthGuard,
    GroupGuard,
    /*strategy*/
    LocalAuthStrategy,
    JwtAuthStrategy,
    /*service*/
    AuthService,
  ],
  exports: [AuthService, JwtAuthGuard, GroupGuard, PermissionGuard],
})
export class AuthModule {}
/* 

Uso Esterno:
Il provider può essere esportato e importato da altri moduli, permettendone l'iniezione in componenti o servizi di altri moduli.

Uso Interno:
Una volta dichiarato, il provider può essere iniettato e usato da altri componenti (come controller o altri servizi) all'interno dello stesso modulo.

*/
/*
In NestJS, non puoi esportare
 qualcosa che non è un provider del modulo stesso. 
 Ogni elemento che vuoi mettere negli exports deve prima essere dichiarato 
 nei providers o essere importato da un altro modulo usando imports. */
